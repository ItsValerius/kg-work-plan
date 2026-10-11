import { toBerlinInputParts } from "@/lib/datetime";

export const SHIFT_OUTSIDE_EVENT = "Die Schicht muss an einem Tag der Veranstaltung beginnen.";

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
