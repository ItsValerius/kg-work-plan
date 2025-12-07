"use server";

import { auth } from "@/auth";
import db from "@/db";
import { taskParticipants } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function remove(taskId: string) {
  try {
    const session = await auth();
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
    throw new Error("Failed to remove task");
  }
}
