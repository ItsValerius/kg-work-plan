"use server";

import db from "@/db";
import { taskParticipants } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const removeUserFromTaskAction = async (selectedRowIds: string[]) => {
  try {
    await db
      .delete(taskParticipants)
      .where(inArray(taskParticipants.id, selectedRowIds));
    revalidatePath("/events");
    revalidatePath("/dashboard");
    console.log("Rows deleted successfully:", selectedRowIds);
  } catch (error) {
    console.error("Failed to delete tasks:", error);
  }
};
