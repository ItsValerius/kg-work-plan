import db from "@/db";
import { taskParticipants, users } from "@/db/schema";
import { logger } from "@/lib/logger";
import { and, eq } from "drizzle-orm";

export async function removeUserFromTask(taskId: string, userId: string) {
  try {
    await db
      .delete(taskParticipants)
      .where(
        and(
          eq(taskParticipants.userId, userId),
          eq(taskParticipants.taskId, taskId)
        )
      );
    return;
  } catch (error) {
    logger.error("Failed to remove task participant", error, { taskId, userId });
    throw new Error("Failed to remove task");
  }
}

export async function updateUserProfile(userId: string, name: string, authenticatedUserId: string) {
  try {
    if (authenticatedUserId !== userId) {
      throw new Error("Unauthorized");
    }

    const updatedUser = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, userId))
      .returning();

    logger.info("User profile updated", { userId });
    return updatedUser[0];
  } catch (error) {
    logger.error("Failed to update user profile", error, { userId });
    throw new Error("Failed to update profile");
  }
}
