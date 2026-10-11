import db from "@/db";
import { events, shifts, tasks } from "@/db/schema";
import { logger } from "@/lib/logger";
import { berlinDaysBetween, moveByBerlinDays } from "@/lib/datetime";
import { eq } from "drizzle-orm";
import { SHIFT_OUTSIDE_EVENT, startsDuringEvent } from "./days";
import type { ShiftInput } from "./types";

export async function createOrUpdateShift(data: ShiftInput, userId: string) {
  try {
    const newShift = await db.transaction(async (tx) => {
      // Every caller (form, quick-add, AI assistant) passes through here.
      const event = await tx.query.events.findFirst({
        where: eq(events.id, data.eventId),
        columns: { startDate: true, endDate: true },
      });
      if (event && !startsDuringEvent(event, new Date(data.startTime))) {
        throw new Error(SHIFT_OUTSIDE_EVENT);
      }
      const previous = data.id
        ? await tx.query.shifts.findFirst({
            where: eq(shifts.id, data.id),
            with: { tasks: true },
          })
        : undefined;

      const [saved] = await tx
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

      // A shift moved to another day takes its tasks along, keeping their clock times.
      const days = previous ? berlinDaysBetween(previous.startTime, saved.startTime) : 0;
      if (previous && days !== 0) {
        // ponytail: one update per task; fine for the handful of tasks in a shift.
        for (const task of previous.tasks) {
          await tx
            .update(tasks)
            .set({ startTime: moveByBerlinDays(task.startTime, days) })
            .where(eq(tasks.id, task.id));
        }
      }
      return saved;
    });

    logger.info("Shift created/updated", {
      shiftId: newShift.id,
      eventId: data.eventId,
      userId,
    });
    return newShift;
  } catch (error) {
    if (error instanceof Error && error.message === SHIFT_OUTSIDE_EVENT) throw error;
    logger.error("Failed to create/update shift", error, { eventId: data.eventId });
    throw new Error("Failed to create/update shift");
  }
}
