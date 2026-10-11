import { toBerlinInputParts } from "@/lib/datetime";

export const SHIFT_OUTSIDE_EVENT = "Die Schicht muss an einem Tag der Veranstaltung beginnen.";
export const SHIFTS_OUTSIDE_EVENT =
  "Dann lägen Schichten außerhalb der Veranstaltungstage. Verschiebe oder lösche sie zuerst.";

/**
 * Whether a shift starts on one of the event's Berlin days. Only the start counts, so a
 * night shift on the last day may still end after midnight.
 */
export function startsDuringEvent(event: { startDate: Date; endDate: Date }, shiftStart: Date) {
  const day = toBerlinInputParts(shiftStart).day;
  return (
    day >= toBerlinInputParts(event.startDate).day && day <= toBerlinInputParts(event.endDate).day
  );
}

/** Throws when an event's new days would leave one of its shifts outside them. */
export function assertShiftsDuringEvent(
  event: { startDate: Date; endDate: Date },
  shiftStarts: Date[],
) {
  if (shiftStarts.some((start) => !startsDuringEvent(event, start))) {
    throw new Error(SHIFTS_OUTSIDE_EVENT);
  }
}
