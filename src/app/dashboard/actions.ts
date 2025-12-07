"use server";

import db from "@/db";
import { taskParticipants } from "@/db/schema";
import { logger } from "@/lib/logger";
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const removeUserFromTaskAction = async (selectedRowIds: string[]) => {
  try {
    await db
      .delete(taskParticipants)
      .where(inArray(taskParticipants.id, selectedRowIds));
    logger.info("Task participants deleted", { count: selectedRowIds.length, ids: selectedRowIds });
    revalidatePath("/events");
    revalidatePath("/dashboard");
  } catch (error) {
    logger.error("Failed to delete task participants", error, { ids: selectedRowIds });
    throw error;
  }
};
