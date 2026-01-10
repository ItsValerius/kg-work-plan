import db from "@/db";
import { taskParticipants } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getTaskParticipants(taskId: string) {
  return db.query.taskParticipants.findMany({
    where: eq(taskParticipants.taskId, taskId),
    with: {
      user: true,
    },
  });
}

export async function getParticipantById(participantId: string) {
  return db.query.taskParticipants.findFirst({
    where: eq(taskParticipants.id, participantId),
    with: {
      task: true,
    },
  });
}

export async function getParticipantsByTaskId(taskId: string) {
  return db.query.taskParticipants.findMany({
    where: eq(taskParticipants.taskId, taskId),
  });
}

export async function getParticipantByUserAndTask(userId: string, taskId: string) {
  return db.query.taskParticipants.findFirst({
    where: and(
      eq(taskParticipants.userId, userId),
      eq(taskParticipants.taskId, taskId)
    ),
  });
}
