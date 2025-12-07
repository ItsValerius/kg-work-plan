import db from "@/db";
import { events, shifts, taskParticipants, tasks } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { eq, inArray } from "drizzle-orm";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getMissingUsersPerEvent(eventId: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });
  if (!event)
    return { currentParticipantsCount: 0, requiredParticipantsCount: 0 };
  const eventShiftIds = (
    await db.query.shifts.findMany({
      columns: { id: true },
      where: eq(shifts.eventId, event.id),
    })
  ).map((v) => v.id);

  const eventTasks = await db.query.tasks.findMany({
    where: inArray(tasks.shiftId, eventShiftIds),
  });

  const eventTasksIds = eventTasks.map((v) => v.id);
  const participants = await db.query.taskParticipants.findMany({
    where: inArray(taskParticipants.taskId, eventTasksIds),
  });
  const currentParticipantsCount = participants.reduce(
    (accumulator, participant) => accumulator + participant.groupSize,
    0
  );
  const requiredParticipantsCount = eventTasks.reduce(
    (accumulator, participant) =>
      accumulator + participant.requiredParticipants,
    0
  );
  return { currentParticipantsCount, requiredParticipantsCount };
}

export async function getMissingUsersPerEvents(
  eventIds: string[]
): Promise<Record<string, { currentParticipantsCount: number; requiredParticipantsCount: number }>> {
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
  const allTasks = allShiftIds.length > 0
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
  const allParticipants = allTaskIds.length > 0
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
  const result: Record<string, { currentParticipantsCount: number; requiredParticipantsCount: number }> = {};

  for (const eventId of eventIds) {
    const eventTasks = tasksByEventId.get(eventId) || [];
    const eventParticipants = participantsByEventId.get(eventId) || [];

    const currentParticipantsCount = eventParticipants.reduce(
      (accumulator, participant) => accumulator + participant.groupSize,
      0
    );
    const requiredParticipantsCount = eventTasks.reduce(
      (accumulator, task) => accumulator + task.requiredParticipants,
      0
    );

    result[eventId] = { currentParticipantsCount, requiredParticipantsCount };
  }

  return result;
}
