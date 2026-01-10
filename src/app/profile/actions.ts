"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import db from "@/db";
import { taskParticipants } from "@/db/schema";
import { logger } from "@/lib/logger";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function remove(taskId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(taskParticipants)
      .where(
        and(
          eq(taskParticipants.userId, session.user.id),
          eq(taskParticipants.taskId, taskId)
        )
      );
    revalidatePath("/profile");
    return;
  } catch (error) {
    logger.error("Failed to remove task participant", error, { taskId });
    throw new Error("Failed to remove task");
  }
}
