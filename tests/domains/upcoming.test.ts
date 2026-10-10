import { describe, expect, it } from "vitest";
import { isUpcomingTask } from "@/domains/tasks/upcoming";
import { fromBerlin } from "@/lib/datetime";

describe("isUpcomingTask", () => {
  const now = fromBerlin("2026-02-16", "00:30");

  it("keeps a night shift that started yesterday until it ends", () => {
    const task = {
      start: fromBerlin("2026-02-15", "22:00"),
      shiftEndTime: fromBerlin("2026-02-16", "03:00"),
    };
    expect(isUpcomingTask(task, now)).toBe(true);
    expect(isUpcomingTask(task, fromBerlin("2026-02-16", "03:30"))).toBe(false);
  });

  it("counts everything on today's Berlin day, even if it already ended", () => {
    const task = {
      start: fromBerlin("2026-02-16", "00:05"),
      shiftEndTime: fromBerlin("2026-02-16", "00:20"),
    };
    expect(isUpcomingTask(task, now)).toBe(true);
  });

  it("treats yesterday's finished shift as past", () => {
    const task = {
      start: fromBerlin("2026-02-15", "10:00"),
      shiftEndTime: fromBerlin("2026-02-15", "14:00"),
    };
    expect(isUpcomingTask(task, now)).toBe(false);
  });
});
