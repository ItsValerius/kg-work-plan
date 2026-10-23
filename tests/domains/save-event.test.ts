import { beforeEach, describe, expect, it, vi } from "vitest";
import { SHIFTS_OUTSIDE_EVENT } from "@/domains/shifts/days";
import { fromBerlin } from "@/lib/datetime";

// A fake transaction: the stored event is a Sat–Sun event with a Sunday shift and task,
// the upsert returns what was sent, and every row update is recorded.
const previous = {
  id: "event-1",
  startDate: fromBerlin("2026-11-14"),
  endDate: fromBerlin("2026-11-15"),
  shifts: [
    {
      id: "shift-1",
      startTime: fromBerlin("2026-11-15", "18:00"),
      endTime: fromBerlin("2026-11-16", "01:00"),
      tasks: [{ id: "task-1", startTime: fromBerlin("2026-11-15", "18:30") }],
    },
  ],
};
const updates: unknown[] = [];
const tx = {
  query: { events: { findFirst: async () => previous } },
  insert: () => ({
    values: (row: object) => ({
      onConflictDoUpdate: () => ({ returning: async () => [{ ...row }] }),
    }),
  }),
  update: () => ({
    set: (values: unknown) => ({ where: async () => updates.push(values) }),
  }),
};
vi.mock("@/db", () => ({
  default: { transaction: (run: (t: typeof tx) => unknown) => run(tx) },
}));
const { createOrUpdateEvent } = await import("@/domains/events/functions");

const save = (startDay: string, endDay: string) =>
  createOrUpdateEvent(
    {
      id: "event-1",
      name: "Biwak",
      description: "",
      startDate: fromBerlin(startDay),
      endDate: fromBerlin(endDay),
    },
    "admin-1",
  );

describe("createOrUpdateEvent", () => {
  beforeEach(() => {
    updates.length = 0;
  });

  it("refuses a shorter event that would leave a shift outside", async () => {
    await expect(save("2026-11-14", "2026-11-14")).rejects.toThrow(SHIFTS_OUTSIDE_EVENT);
    expect(updates).toEqual([]);
  });

  it("moves shifts and tasks along with a moved start, keeping clock times", async () => {
    await save("2026-11-21", "2026-11-22");
    expect(updates).toEqual([
      {
        startTime: fromBerlin("2026-11-22", "18:00"),
        endTime: fromBerlin("2026-11-23", "01:00"),
      },
      { startTime: fromBerlin("2026-11-22", "18:30") },
    ]);
  });
});
