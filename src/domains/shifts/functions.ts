import db from "@/db";
import { shifts } from "@/db/schema";
import { logger } from "@/lib/logger";
import type { ShiftInput } from "./types";

export async function createOrUpdateShift(data: ShiftInput, userId: string) {
  try {
    const newShift = await db
      .insert(shifts)
      .values({
        id: data.id,
        name: data.name,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        eventId: data.eventId,
        createdById: userId,
      })
      .onConflictDoUpdate({
        target: shifts.id,
        set: {
          name: data.name,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
        },
      })
      .returning();

    logger.info("Shift created/updated", { shiftId: newShift[0].id, eventId: data.eventId, userId });
    return newShift[0];
  } catch (error) {
    logger.error("Failed to create/update shift", error, { eventId: data.eventId });
    throw new Error("Failed to create/update shift");
  }
}
