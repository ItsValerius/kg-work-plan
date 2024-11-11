"use server";

import { auth } from "@/auth";
import db from "@/db";
import { shifts, tasks } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteTask = async (taskId: string) => {
  try {
    const session = await auth();
    if (!isAdmin(session?.user)) {
      throw new Error("Unauthorized");
    }

    await db.delete(tasks).where(eq(tasks.id, taskId)).returning();

    revalidatePath("/events");
    return;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to remove event");
  }
};

export const deleteShift = async (shiftId: string) => {
  try {
    const session = await auth();
    if (!isAdmin(session?.user)) {
      throw new Error("Unauthorized");
    }

    const deletedShift = await db
      .delete(shifts)
      .where(eq(shifts.id, shiftId))
      .returning();

    revalidatePath(`/events/${deletedShift[0].eventId}`);
    return;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to remove event");
  }
};
