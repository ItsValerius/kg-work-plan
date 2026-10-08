/** The shape every open-spot count needs: what a task requires and the groups on it. */
interface SpotTask {
  requiredParticipants: number;
  participants: { groupSize: number }[];
}

/** People on a task, people it needs, and spots still open (never below zero). */
export function taskSpots(task: SpotTask) {
  const filled = task.participants.reduce((sum, p) => sum + p.groupSize, 0);
  return {
    filled,
    required: task.requiredParticipants,
    open: Math.max(0, task.requiredParticipants - filled),
  };
}

/** The same counts summed over many tasks, e.g. a whole event. */
export function sumSpots(tasks: SpotTask[]) {
  return tasks.map(taskSpots).reduce(
    (total, spots) => ({
      filled: total.filled + spots.filled,
      required: total.required + spots.required,
      open: total.open + spots.open,
    }),
    { filled: 0, required: 0, open: 0 },
  );
}

/** Counts for an event with its shifts and tasks. */
export function eventSpots(event: { shifts: { tasks: SpotTask[] }[] }) {
  return sumSpots(event.shifts.flatMap((shift) => shift.tasks));
}
