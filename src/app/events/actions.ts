"use server";

import db from "@/db";
import { events } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { logger } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteEvent = async (eventId: string) => {
  try {
    if (!(await isAdmin())) {
      throw new Error("Unauthorized");
    }

    await db.delete(events).where(eq(events.id, eventId));

    logger.info("Event deleted", { eventId });
    revalidatePath("/events");
    return;
  } catch (error) {
    logger.error("Failed to delete event", error, { eventId });
    throw new Error("Failed to remove event");
  }
};
