import db from "@/db";
import { taskParticipants } from "@/db/schema";
import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import type { ParticipantsData, ShiftFilterOption, TaskFilterOption } from "./types";

export async function getParticipantsData(): Promise<ParticipantsData> {
  "use cache";
  cacheLife("workplan");
  cacheTag(WORKPLAN_TAG);
  const userTasks = await db.query.taskParticipants.findMany({
    with: {
      user: { columns: { name: true, email: true } },
      task: {
        columns: { name: true, startTime: true },
        with: {
          shift: {
            with: { event: { columns: { id: true, name: true } } },
            columns: { id: true, name: true },
          },
        },
      },
    },
    orderBy: desc(taskParticipants.createdAt),
  });

  // Only what the filters show.
  const [allEvents, allShifts, allTasks] = await Promise.all([
    db.query.events.findMany({ columns: { id: true, name: true } }),
    db.query.shifts.findMany({
      columns: { id: true, name: true, eventId: true },
      with: { event: { columns: { name: true } } },
    }),
    db.query.tasks.findMany({
      columns: { id: true, name: true },
      with: {
        shift: {
          with: { event: { columns: { id: true, name: true } } },
          columns: { id: true, name: true },
        },
      },
    }),
  ]);

  const shiftsForFilter: ShiftFilterOption[] = allShifts.map((shift) => ({
    id: shift.id,
    name: shift.name,
    eventId: shift.eventId,
    eventName: shift.event.name,
  }));

  const tasksForFilter: TaskFilterOption[] = allTasks.map((task) => ({
    id: task.id,
    name: task.name,
    shiftId: task.shift.id,
    shiftName: task.shift.name,
    eventId: task.shift.event.id,
  }));

  return {
    userTasks,
    allEvents,
    shiftsForFilter,
    tasksForFilter,
  };
}
