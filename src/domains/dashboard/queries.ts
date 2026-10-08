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
            with: { event: { columns: { name: true } } },
            columns: { name: true },
          },
        },
      },
    },
    orderBy: desc(taskParticipants.createdAt),
  });

  const allEvents = await db.query.events.findMany();

  const allShifts = await db.query.shifts.findMany({
    with: {
      event: { columns: { name: true } },
    },
  });

  const allTasks = await db.query.tasks.findMany({
    with: {
      shift: {
        with: { event: { columns: { id: true, name: true } } },
        columns: { id: true, name: true },
      },
      participants: true,
    },
  });

  const shiftsForFilter: ShiftFilterOption[] = allShifts.map((shift) => ({
    id: shift.id,
    name: shift.name,
    eventName: shift.event.name,
  }));

  const tasksForFilter: TaskFilterOption[] = allTasks.map((task) => ({
    id: task.id,
    name: task.name,
    shiftName: task.shift.name,
  }));

  return {
    userTasks,
    allEvents,
    shiftsForFilter,
    tasksForFilter,
  };
}
