import db from "@/db";
import { tasks } from "@/db/schema";
import { logger } from "@/lib/logger";
import type { TaskInput } from "./types";

export async function createOrUpdateTask(data: TaskInput, userId: string) {
  try {
    const newTask = await db
      .insert(tasks)
      .values({
        id: data.id,
        name: data.name,
        description: data.description,
        shiftId: data.shiftId,
        startTime: data.startTime,
        requiredParticipants: data.requiredParticipants,
        createdById: userId,
      })
      .onConflictDoUpdate({
        target: tasks.id,
        set: {
          name: data.name,
          description: data.description,
          startTime: data.startTime,
          requiredParticipants: data.requiredParticipants,
        },
      })
      .returning();

    logger.info("Task created/updated", { taskId: newTask[0].id, shiftId: data.shiftId, userId });
    return newTask[0];
  } catch (error) {
    logger.error("Failed to create/update task", error, { shiftId: data.shiftId });
    throw new Error("Failed to create/update task");
  }
}
