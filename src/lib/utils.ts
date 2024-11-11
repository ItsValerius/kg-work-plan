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
