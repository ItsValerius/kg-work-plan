import db from "@/db";
import { events, tasks, taskParticipants, shifts } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { sql } from "drizzle-orm";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getMissingUsersPerEvent() {
  const result = await db
    .select({
      eventId: events.id,
      eventName: events.name,
      totalRequired: sql<number>`sum(${tasks.requiredParticipants})`,
      totalAssigned: sql<number>`sum(${taskParticipants.groupSize})`,
      missing: sql<number>`sum(${tasks.requiredParticipants}) - coalesce(sum(${taskParticipants.groupSize}), 0)`,
    })
    .from(events)
    .leftJoin(shifts, sql`${shifts.eventId} = ${events.id}`)
    .leftJoin(tasks, sql`${tasks.shiftId} = ${shifts.id}`)
    .leftJoin(taskParticipants, sql`${taskParticipants.taskId} = ${tasks.id}`)
    .groupBy(events.id, events.name)
    .having(
      sql`sum(${tasks.requiredParticipants}) - coalesce(sum(${taskParticipants.groupSize}), 0) > 0`
    );

  return result;
}
