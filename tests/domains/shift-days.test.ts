import { describe, expect, it } from "vitest";
import {
  assertShiftsDuringEvent,
  SHIFTS_OUTSIDE_EVENT,
  startsDuringEvent,
} from "@/domains/shifts/days";
import { fromBerlin } from "@/lib/datetime";

// A two-day event, 11.–12.11. (Berlin).
const event = { startDate: fromBerlin("2026-11-11"), endDate: fromBerlin("2026-11-12") };

describe("shifts within the event's days", () => {
  it("accept any start on the event's days, by Berlin time", () => {
    expect(startsDuringEvent(event, fromBerlin("2026-11-11", "08:00"))).toBe(true);
    // 23:30 Berlin on the last day is already the 13th in UTC.
    expect(startsDuringEvent(event, fromBerlin("2026-11-12", "23:30"))).toBe(true);
  });

  it("refuse starts before or after them", () => {
    expect(startsDuringEvent(event, fromBerlin("2026-11-10", "23:30"))).toBe(false);
    expect(startsDuringEvent(event, fromBerlin("2026-11-13", "00:30"))).toBe(false);
  });
});

describe("an event's new days", () => {
  it("refuse to leave a shift outside them", () => {
    const shortened = { ...event, endDate: event.startDate };
    const sundayShift = fromBerlin("2026-11-12", "18:00");
    expect(() => assertShiftsDuringEvent(event, [sundayShift])).not.toThrow();
    expect(() => assertShiftsDuringEvent(shortened, [sundayShift])).toThrow(SHIFTS_OUTSIDE_EVENT);
  });
});
