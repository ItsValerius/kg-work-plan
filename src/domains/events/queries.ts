import db from "@/db";
import { events, shifts, tasks, taskParticipants } from "@/db/schema";
import { getStartOfToday } from "@/lib/datetime";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import { asc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import type { EventParticipantCounts } from "./types";

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

function countOpenSpots(
  eventTasks: { id: string; requiredParticipants: number }[],
  participants: { taskId: string; groupSize: number }[],
): number {
  const filledByTask = new Map<string, number>();
  for (const participant of participants) {
    filledByTask.set(
      participant.taskId,
      (filledByTask.get(participant.taskId) ?? 0) + participant.groupSize,
    );
  }
  return eventTasks.reduce(
    (open, task) =>
      open + Math.max(0, task.requiredParticipants - (filledByTask.get(task.id) ?? 0)),
    0,
  );
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

  // Get all shifts for all events
  const allShifts = await db.query.shifts.findMany({
    columns: { id: true, eventId: true },
    where: inArray(shifts.eventId, eventIds),
  });

  // Group shifts by eventId
  const shiftsByEventId = new Map<string, string[]>();
  for (const shift of allShifts) {
    if (!shiftsByEventId.has(shift.eventId)) {
      shiftsByEventId.set(shift.eventId, []);
    }
    shiftsByEventId.get(shift.eventId)!.push(shift.id);
  }

  // Get all tasks for all shifts
  const allShiftIds = allShifts.map((s) => s.id);
  const allTasks =
    allShiftIds.length > 0
      ? await db.query.tasks.findMany({
          where: inArray(tasks.shiftId, allShiftIds),
        })
      : [];

  // Group tasks by eventId (via shiftId -> eventId mapping)
  const shiftIdToEventId = new Map<string, string>();
  for (const shift of allShifts) {
    shiftIdToEventId.set(shift.id, shift.eventId);
  }

  const tasksByEventId = new Map<string, typeof allTasks>();
  for (const task of allTasks) {
    const eventId = shiftIdToEventId.get(task.shiftId);
    if (eventId) {
      if (!tasksByEventId.has(eventId)) {
        tasksByEventId.set(eventId, []);
      }
      tasksByEventId.get(eventId)!.push(task);
    }
  }

  // Get all participants for all tasks
  const allTaskIds = allTasks.map((t) => t.id);
  const allParticipants =
    allTaskIds.length > 0
      ? await db.query.taskParticipants.findMany({
          where: inArray(taskParticipants.taskId, allTaskIds),
        })
      : [];

  // Group participants by taskId, then by eventId
  const taskIdToEventId = new Map<string, string>();
  for (const task of allTasks) {
    const eventId = shiftIdToEventId.get(task.shiftId);
    if (eventId) {
      taskIdToEventId.set(task.id, eventId);
    }
  }

  const participantsByEventId = new Map<string, typeof allParticipants>();
  for (const participant of allParticipants) {
    const eventId = taskIdToEventId.get(participant.taskId);
    if (eventId) {
      if (!participantsByEventId.has(eventId)) {
        participantsByEventId.set(eventId, []);
      }
      participantsByEventId.get(eventId)!.push(participant);
    }
  }

  // Calculate counts for each event
  const result: EventParticipantCounts = {};

  for (const eventId of eventIds) {
    const eventTasks = tasksByEventId.get(eventId) || [];
    const eventParticipants = participantsByEventId.get(eventId) || [];

    const currentParticipantsCount = eventParticipants.reduce(
      (accumulator, participant) => accumulator + participant.groupSize,
      0,
    );
    const requiredParticipantsCount = eventTasks.reduce(
      (accumulator, task) => accumulator + task.requiredParticipants,
      0,
    );

    const openSpotsCount = countOpenSpots(eventTasks, eventParticipants);

    result[eventId] = { currentParticipantsCount, requiredParticipantsCount, openSpotsCount };
  }

  return result;
}
