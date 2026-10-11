import { describe, expect, it, vi } from "vitest";
import { SHIFTS_OUTSIDE_EVENT } from "@/domains/shifts/days";
import { fromBerlin } from "@/lib/datetime";

// A Sat–Sun event with a Sunday shift; nothing may be written when the copy is too short.
const transaction = vi.fn();
vi.mock("@/db", () => ({ default: { transaction } }));
vi.mock("@/domains/events/queries", () => ({
  getEventByIdWithShiftsAndTasks: async () => ({
    id: "event-1",
    description: "",
    startDate: fromBerlin("2026-11-14"),
    endDate: fromBerlin("2026-11-15"),
    shifts: [
      {
        name: "Sonntag",
        startTime: fromBerlin("2026-11-15", "18:00"),
        endTime: fromBerlin("2026-11-15", "22:00"),
        tasks: [],
      },
    ],
  }),
}));
const { duplicateEvent } = await import("@/domains/events/functions");

describe("duplicateEvent", () => {
  it("refuses a copy whose days would leave a shift outside", async () => {
    const saturday = fromBerlin("2027-11-13");
    await expect(duplicateEvent("event-1", "Kopie", saturday, saturday, "admin-1")).rejects.toThrow(
      SHIFTS_OUTSIDE_EVENT,
    );
    expect(transaction).not.toHaveBeenCalled();
  });
});
