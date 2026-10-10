import db from "@/db";
import { taskParticipants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getParticipantById(participantId: string) {
  return db.query.taskParticipants.findFirst({
    where: eq(taskParticipants.id, participantId),
    with: {
      task: true,
    },
  });
}
