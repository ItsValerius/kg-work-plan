import db from "@/db";
import { events, shifts, tasks } from "@/db/schema";
import { logger } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { getEventByIdWithShiftsAndTasks } from "./queries";
import type { EventInput, ShiftIdMapValue } from "./types";

export async function createOrUpdateEvent(data: EventInput, userId: string) {
  try {
    const newEvent = await db
      .insert(events)
      .values({
        id: data.id,
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        createdById: userId,
      })
      .onConflictDoUpdate({
        target: events.id,
        set: {
          name: data.name,
          description: data.description,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        },
      })
      .returning();

    logger.info("Event created/updated", { eventId: newEvent[0].id, userId });
    return newEvent[0];
  } catch (error) {
    logger.error("Failed to create/update event", error);
    throw new Error("Failed to create/update event");
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await db.delete(events).where(eq(events.id, eventId));

    logger.info("Event deleted", { eventId });
    return;
  } catch (error) {
    logger.error("Failed to delete event", error, { eventId });
    throw new Error("Failed to remove event");
  }
}

export async function duplicateEvent(
  eventId: string,
  name: string,
  startDate: Date,
  endDate: Date,
  userId: string
) {
  try {
    // Fetch the original event with all shifts and tasks
    const originalEvent = await getEventByIdWithShiftsAndTasks(eventId);

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
        createdById: userId,
      })
      .returning();

    // Create mappings of old IDs to new data
    const shiftIdMap = new Map<string, ShiftIdMapValue>();

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
          createdById: userId,
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
          createdById: userId,
        });
      }
    }

    logger.info("Event duplicated", {
      originalEventId: eventId,
      newEventId: newEvent.id,
      userId: userId,
    });

    return newEvent.id;
  } catch (error) {
    logger.error("Failed to duplicate event", error, { eventId });
    throw new Error("Failed to duplicate event");
  }
}

export async function deleteTask(taskId: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId)).returning();

    return;
  } catch (error) {
    logger.error("Failed to delete task", error, { taskId });
    throw new Error("Failed to remove event");
  }
}

export async function deleteShift(shiftId: string) {
  try {
    const deletedShift = await db
      .delete(shifts)
      .where(eq(shifts.id, shiftId))
      .returning();

    return deletedShift[0];
  } catch (error) {
    logger.error("Failed to delete shift", error, { shiftId });
    throw new Error("Failed to remove event");
  }
}
