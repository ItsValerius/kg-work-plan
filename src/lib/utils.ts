import db from "@/db";
import { events, tasks, taskParticipants, shifts } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { sql, eq } from "drizzle-orm";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getMissingUsersPerEvent() {
  return await db
    .select({
      eventId: events.id,
      eventName: events.name,
      totalRequired: sql<number>`sum(${tasks.requiredParticipants})`,
      totalAssigned: sql<number>`sum(${taskParticipants.groupSize})`,
      missing: sql<number>`sum(${tasks.requiredParticipants}) - coalesce(sum(${taskParticipants.groupSize}), 0)`,
    })
    .from(events)
    .leftJoin(shifts, eq(shifts.eventId, events.id))
    .leftJoin(tasks, eq(tasks.shiftId, shifts.id))
    .leftJoin(taskParticipants, eq(taskParticipants.taskId, tasks.id))
    .groupBy(events.id);
}
