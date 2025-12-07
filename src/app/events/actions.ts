"use server";

import { auth } from "@/auth";
import db from "@/db";
import { events, shifts, tasks } from "@/db/schema";
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

export const duplicateEvent = async (
  eventId: string,
  name: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const session = await auth();
    if (!session?.user?.id || !(await isAdmin())) {
      throw new Error("Unauthorized");
    }

    // Fetch the original event with all shifts and tasks
    const originalEvent = await db.query.events.findFirst({
      where: eq(events.id, eventId),
      with: {
        shifts: {
          with: {
            tasks: true,
          },
        },
      },
    });

    if (!originalEvent) {
      throw new Error("Event not found");
    }

    const originalStartDate = new Date(originalEvent.startDate);
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    // Create the new event
    const [newEvent] = await db
      .insert(events)
      .values({
        name,
        description: originalEvent.description,
        startDate: newStartDate,
        endDate: newEndDate,
        createdById: session.user.id,
      })
      .returning();

    // Create mappings of old IDs to new data
    const shiftIdMap = new Map<string, { id: string; startTime: Date }>();

    // Duplicate shifts
    for (const originalShift of originalEvent.shifts) {
      const originalShiftStart = new Date(originalShift.startTime);
      const originalShiftEnd = new Date(originalShift.endTime);

      // Calculate relative time from event start
      const relativeStartMs = originalShiftStart.getTime() - originalStartDate.getTime();
      const relativeEndMs = originalShiftEnd.getTime() - originalStartDate.getTime();

      // Apply the same relative offset to new dates
      const newShiftStart = new Date(newStartDate.getTime() + relativeStartMs);
      const newShiftEnd = new Date(newStartDate.getTime() + relativeEndMs);

      const [newShift] = await db
        .insert(shifts)
        .values({
          eventId: newEvent.id,
          name: originalShift.name,
          startTime: newShiftStart,
          endTime: newShiftEnd,
          createdById: session.user.id,
        })
        .returning();

      shiftIdMap.set(originalShift.id, { id: newShift.id, startTime: newShiftStart });
    }

    // Duplicate tasks
    for (const originalShift of originalEvent.shifts) {
      const newShiftData = shiftIdMap.get(originalShift.id);
      if (!newShiftData) continue;

      for (const originalTask of originalShift.tasks) {
        const originalTaskStart = new Date(originalTask.startTime);
        
        // Calculate relative time from shift start
        const originalShiftStart = new Date(originalShift.startTime);
        const relativeTaskMs = originalTaskStart.getTime() - originalShiftStart.getTime();

        // Apply relative offset to new shift start time
        const newTaskStart = new Date(newShiftData.startTime.getTime() + relativeTaskMs);

        await db.insert(tasks).values({
          shiftId: newShiftData.id,
          name: originalTask.name,
          description: originalTask.description,
          startTime: newTaskStart,
          requiredParticipants: originalTask.requiredParticipants,
          createdById: session.user.id,
        });
      }
    }

    logger.info("Event duplicated", {
      originalEventId: eventId,
      newEventId: newEvent.id,
      userId: session.user.id,
    });

    revalidatePath("/events");
    return newEvent.id;
  } catch (error) {
    logger.error("Failed to duplicate event", error, { eventId });
    throw new Error("Failed to duplicate event");
  }
};
