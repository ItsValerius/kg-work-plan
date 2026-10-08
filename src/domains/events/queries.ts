import db from "@/db";
import { events, shifts, tasks, taskParticipants } from "@/db/schema";
import { getStartOfToday } from "@/lib/datetime";
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
  const startOfToday = getStartOfToday();
  return (await getAllEvents()).filter((event) => event.endDate >= startOfToday);
}

export async function getPastEvents() {
  await connection();
  const startOfToday = getStartOfToday();
  return (await getAllEvents()).filter((event) => event.endDate < startOfToday);
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
                with: { user: { columns: { name: true, email: true } } },
              },
            },
          },
        },
      },
    },
  });
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
