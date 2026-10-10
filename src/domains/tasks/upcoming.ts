import { toBerlinInputParts } from "@/lib/datetime";

/**
 * Whether a helper's task still counts as upcoming: anything on today's Berlin day (like
 * the event list), plus a night shift that started yesterday and hasn't ended yet. Helpers
 * can change their sign-up until the shift ends, so it must stay among the open ones.
 */
export function isUpcomingTask(
  task: { start: Date; shiftEndTime: Date },
  now: Date = new Date(),
): boolean {
  return (
    toBerlinInputParts(task.start).day >= toBerlinInputParts(now).day || task.shiftEndTime > now
  );
}
