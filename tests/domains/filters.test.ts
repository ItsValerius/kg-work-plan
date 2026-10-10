import { describe, expect, it } from "vitest";
import { changePlanFilter } from "@/domains/dashboard/filters";

const shifts = [
  { id: "s1", eventId: "e1" },
  { id: "s2", eventId: "e1" },
  { id: "s3", eventId: "e2" },
];
const tasks = [
  { id: "t1", shiftId: "s1", eventId: "e1" },
  { id: "t3", shiftId: "s3", eventId: "e2" },
];

describe("changePlanFilter", () => {
  it("drops a shift and task from another event when the event changes", () => {
    const current = { eventId: "e1", shiftId: "s1", taskId: "t1" };
    expect(changePlanFilter(current, "event", "e2", shifts, tasks)).toEqual({
      eventId: "e2",
      shiftId: undefined,
      taskId: undefined,
    });
    expect(changePlanFilter(current, "event", "e1", shifts, tasks)).toEqual(current);
  });

  it("fills in the parents when a shift or task is picked", () => {
    expect(changePlanFilter({}, "task", "t3", shifts, tasks)).toEqual({
      eventId: "e2",
      shiftId: "s3",
      taskId: "t3",
    });
    expect(changePlanFilter({ taskId: "t1" }, "shift", "s2", shifts, tasks)).toEqual({
      eventId: "e1",
      shiftId: "s2",
      taskId: undefined,
    });
  });
});
