import db from "@/db";
import { events, shifts, taskParticipants, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import type { UserTask } from "./types";

export async function getUserTasks(userId: string): Promise<UserTask[]> {
  "use cache";
  cacheLife("workplan");
  cacheTag(WORKPLAN_TAG);
  return db
    .select({
      id: tasks.id,
      name: tasks.name,
      description: tasks.description,
      shifts: tasks.shiftId,
      startTime: tasks.startTime,
      shiftDate: shifts.startTime,
      shiftName: shifts.name,
      shiftEndTime: shifts.endTime,
      eventId: events.id,
      eventName: events.name,
      participantId: taskParticipants.id,
      groupName: taskParticipants.groupName,
      groupSize: taskParticipants.groupSize,
      requiredParticipants: tasks.requiredParticipants,
    })
    .from(taskParticipants)
    // These joins are safe as taskParticipants.taskId and tasks.shiftId are non-null
    // and have FK constraints, so the joined records should always exist.
    .innerJoin(tasks, eq(taskParticipants.taskId, tasks.id))
    .innerJoin(shifts, eq(tasks.shiftId, shifts.id))
    .innerJoin(events, eq(shifts.eventId, events.id))
    .where(eq(taskParticipants.userId, userId))
    .orderBy(tasks.startTime);
}

export async function getTaskById(taskId: string) {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });
}

export async function getTaskByIdWithShift(taskId: string) {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: {
      shift: true,
    },
  });
}

export async function getTaskWithParticipants(taskId: string) {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: {
      participants: true,
    },
  });
}
