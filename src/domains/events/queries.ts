import db from "@/db";
import { events, shifts, tasks, taskParticipants, users } from "@/db/schema";
import { berlinToday, toBerlinInputParts } from "@/lib/datetime";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import { asc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import type { EventParticipantCounts } from "./types";
import { eventSpots } from "@/domains/tasks/spots";

async function getAllEvents() {
  "use cache";
  cacheLife("workplan");
  cacheTag(WORKPLAN_TAG);
  return db.query.events.findMany({ orderBy: [asc(events.startDate)] });
}

// The list is cached; which events count as upcoming depends on the request's "today".
export async function getFutureEvents() {
  await connection();
  const today = berlinToday();
  return (await getAllEvents()).filter((event) => toBerlinInputParts(event.endDate).day >= today);
}

export async function getPastEvents() {
  await connection();
  const today = berlinToday();
  return (await getAllEvents()).filter((event) => toBerlinInputParts(event.endDate).day < today);
}

export async function getEventById(eventId: string) {
  return db.query.events.findFirst({
    where: eq(events.id, eventId),
  });
}

export async function getEventByIdWithShiftsAndTasks(eventId: string) {
  return db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      shifts: {
        with: {
          tasks: true,
        },
      },
    },
  });
}

/**
 * The full work plan of an event: shifts, their tasks and everyone signed up,
 * loaded in one query for the sign-up sheet.
 */
export async function getEventWorkPlan(eventId: string) {
  "use cache";
  cacheLife("workplan");
  cacheTag(WORKPLAN_TAG);
  return db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      shifts: {
        orderBy: shifts.startTime,
        with: {
          tasks: {
            orderBy: tasks.startTime,
            with: {
              participants: {
                orderBy: taskParticipants.createdAt,
                // No email here: this query also feeds the public sign-up sheet.
                with: { user: { columns: { name: true } } },
              },
            },
          },
        },
      },
    },
  });
}

/** Organizer-only: the email of everyone signed up for the event, by user id. */
export async function getHelperEmails(eventId: string): Promise<Record<string, string>> {
  "use cache";
  cacheLife("workplan");
  cacheTag(WORKPLAN_TAG);
  const rows = await db
    .selectDistinct({ id: users.id, email: users.email })
    .from(taskParticipants)
    .innerJoin(users, eq(taskParticipants.userId, users.id))
    .innerJoin(tasks, eq(taskParticipants.taskId, tasks.id))
    .innerJoin(shifts, eq(tasks.shiftId, shifts.id))
    .where(eq(shifts.eventId, eventId));
  return Object.fromEntries(rows.map((row) => [row.id, row.email]));
}

export type EventWorkPlan = NonNullable<Awaited<ReturnType<typeof getEventWorkPlan>>>;

export async function getMissingUsersPerEvents(
  eventIds: string[],
): Promise<EventParticipantCounts> {
  "use cache";
  cacheLife("workplan");
  cacheTag(WORKPLAN_TAG);
  if (eventIds.length === 0) return {};

  const rows = await db.query.events.findMany({
    columns: { id: true },
    where: inArray(events.id, eventIds),
    with: {
      shifts: {
        columns: {},
        with: {
          tasks: {
            columns: { requiredParticipants: true },
            with: { participants: { columns: { groupSize: true } } },
          },
        },
      },
    },
  });

  const result: EventParticipantCounts = {};
  for (const event of rows) {
    const spots = eventSpots(event);
    result[event.id] = {
      currentParticipantsCount: spots.filled,
      requiredParticipantsCount: spots.required,
      openSpotsCount: spots.open,
    };
  }
  return result;
}
