import type { EventWorkPlan } from "@/domains/events/queries";
import type { Event } from "@/domains/events/types";
import { eventSpots, sumSpots, taskSpots } from "@/domains/tasks/spots";
import { toBerlinInputParts } from "@/lib/datetime";

/*
  What AI assistants see and send. Times are Berlin wall-clock strings ("2026-11-11",
  "20:00") so a model never handles UTC, and helpers appear only as counts: names and
  emails never leave the app.
*/

const day = (date: Date) => toBerlinInputParts(date).day;
const time = (date: Date) => toBerlinInputParts(date).time;

export function toEventSummary(
  event: Event,
  counts?: {
    currentParticipantsCount: number;
    requiredParticipantsCount: number;
    openSpotsCount: number;
  },
) {
  return {
    id: event.id,
    name: event.name,
    startDay: day(event.startDate),
    endDay: day(event.endDate),
    spots: counts && {
      filled: counts.currentParticipantsCount,
      required: counts.requiredParticipantsCount,
      open: counts.openSpotsCount,
    },
  };
}

/** The work plan with every participant reduced to the spot counts. */
export function toWorkPlan(event: EventWorkPlan) {
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    startDay: day(event.startDate),
    endDay: day(event.endDate),
    spots: eventSpots(event),
    shifts: event.shifts.map((shift) => ({
      id: shift.id,
      name: shift.name,
      day: day(shift.startTime),
      start: time(shift.startTime),
      end: time(shift.endTime),
      spots: sumSpots(shift.tasks),
      tasks: shift.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        day: day(task.startTime),
        start: time(task.startTime),
        spots: taskSpots(task),
      })),
    })),
  };
}
