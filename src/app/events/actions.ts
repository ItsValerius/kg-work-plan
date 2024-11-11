"use server";

import { auth } from "@/auth";
import db from "@/db";
import { events } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteEvent = async (eventId: string) => {
  try {
    const session = await auth();
    if (!isAdmin(session?.user)) {
      throw new Error("Unauthorized");
    }

    await db.delete(events).where(eq(events.id, eventId));

    revalidatePath("/events");
    return;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to remove event");
  }
};
