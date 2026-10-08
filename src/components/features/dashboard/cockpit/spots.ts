import type { EventWorkPlan } from "@/domains/events/queries";

type Task = EventWorkPlan["shifts"][number]["tasks"][number];

export function taskSpots(task: Task) {
  const filled = task.participants.reduce((sum, p) => sum + p.groupSize, 0);
  return { filled, required: task.requiredParticipants, open: Math.max(0, task.requiredParticipants - filled) };
}

export function eventSpots(event: EventWorkPlan) {
  let required = 0;
  let open = 0;
  for (const shift of event.shifts) {
    for (const task of shift.tasks) {
      const spots = taskSpots(task);
      required += spots.required;
      open += spots.open;
    }
  }
  return { required, open };
}
