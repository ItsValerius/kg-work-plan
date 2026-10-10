import type { ShiftFilterOption, TaskFilterOption } from "./types";

export interface PlanFilter {
  eventId?: string;
  shiftId?: string;
  taskId?: string;
}

/**
 * The event → shift → task filter after one of them changes. It never holds an impossible
 * combination: a new parent drops children from elsewhere, a new child fills in its parents.
 */
export function changePlanFilter(
  current: PlanFilter,
  level: "event" | "shift" | "task",
  id: string,
  shifts: Pick<ShiftFilterOption, "id" | "eventId">[],
  tasks: Pick<TaskFilterOption, "id" | "shiftId" | "eventId">[],
): PlanFilter {
  const currentShift = shifts.find((s) => s.id === current.shiftId);
  const currentTask = tasks.find((t) => t.id === current.taskId);

  if (level === "event") {
    return {
      eventId: id,
      shiftId: currentShift?.eventId === id ? currentShift.id : undefined,
      taskId: currentTask?.eventId === id ? currentTask.id : undefined,
    };
  }

  if (level === "shift") {
    const shift = shifts.find((s) => s.id === id);
    if (!shift) return current;
    return {
      eventId: shift.eventId,
      shiftId: shift.id,
      taskId: currentTask?.shiftId === shift.id ? currentTask.id : undefined,
    };
  }

  const task = tasks.find((t) => t.id === id);
  if (!task) return current;
  return { eventId: task.eventId, shiftId: task.shiftId, taskId: task.id };
}
