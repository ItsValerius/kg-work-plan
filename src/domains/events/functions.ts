import db from "@/db";
import { events, shifts, tasks } from "@/db/schema";
import { logger } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { berlinDaysBetween, moveByBerlinDays } from "@/lib/datetime";
import { getEventByIdWithShiftsAndTasks } from "./queries";
import type { EventInput } from "./types";

export async function createOrUpdateEvent(data: EventInput, userId: string) {
  try {
    const savedEvent = await db.transaction(async (tx) => {
      const previous = data.id
        ? await tx.query.events.findFirst({
            where: eq(events.id, data.id),
            with: { shifts: { with: { tasks: true } } },
          })
        : undefined;

      const [saved] = await tx
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

      // A new date moves the whole plan by the same number of days, keeping clock times.
      const days = previous ? berlinDaysBetween(previous.startDate, saved.startDate) : 0;
      if (previous && days !== 0) {
        // ponytail: one update per row; fine for a club event's few dozen shifts and tasks.
        for (const shift of previous.shifts) {
          await tx
            .update(shifts)
            .set({
              startTime: moveByBerlinDays(shift.startTime, days),
              endTime: moveByBerlinDays(shift.endTime, days),
            })
            .where(eq(shifts.id, shift.id));
          for (const task of shift.tasks) {
            await tx
              .update(tasks)
              .set({ startTime: moveByBerlinDays(task.startTime, days) })
              .where(eq(tasks.id, task.id));
          }
        }
      }
      return saved;
    });

    logger.info("Event created/updated", { eventId: savedEvent.id, userId });
    return savedEvent;
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
  userId: string,
) {
  try {
    // Fetch the original event with all shifts and tasks
    const originalEvent = await getEventByIdWithShiftsAndTasks(eventId);

    if (!originalEvent) {
      throw new Error("Event not found");
    }

    const newStartDate = new Date(startDate);
    // The copy keeps every clock time, moved by the days between the two event starts.
    const days = berlinDaysBetween(originalEvent.startDate, newStartDate);
    const shiftTime = (time: Date) => moveByBerlinDays(time, days);

    // All or nothing: a dropped connection must not leave a half-copied event.
    const newEvent = await db.transaction(async (tx) => {
      const [newEvent] = await tx
        .insert(events)
        .values({
          name,
          description: originalEvent.description,
          startDate: newStartDate,
          endDate: new Date(endDate),
          createdById: userId,
        })
        .returning();

      if (originalEvent.shifts.length === 0) {
        return newEvent;
      }

      // Ids are made here so tasks can point at their new shift without relying on row order.
      const newShiftIds = originalEvent.shifts.map(() => crypto.randomUUID());
      await tx.insert(shifts).values(
        originalEvent.shifts.map((shift, index) => ({
          id: newShiftIds[index],
          eventId: newEvent.id,
          name: shift.name,
          startTime: shiftTime(shift.startTime),
          endTime: shiftTime(shift.endTime),
          createdById: userId,
        })),
      );

      const newTasks = originalEvent.shifts.flatMap((shift, index) =>
        shift.tasks.map((task) => ({
          shiftId: newShiftIds[index],
          name: task.name,
          description: task.description,
          startTime: shiftTime(task.startTime),
          requiredParticipants: task.requiredParticipants,
          createdById: userId,
        })),
      );
      if (newTasks.length > 0) {
        await tx.insert(tasks).values(newTasks);
      }

      return newEvent;
    });

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
    const deletedShift = await db.delete(shifts).where(eq(shifts.id, shiftId)).returning();

    return deletedShift[0];
  } catch (error) {
    logger.error("Failed to delete shift", error, { shiftId });
    throw new Error("Failed to remove event");
  }
}
