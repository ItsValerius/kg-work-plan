import { describe, expect, it } from "vitest";
import { duplicateEventSchema, eventSchema } from "@/domains/events/types";
import { quickAddShiftSchema, shiftSchema } from "@/domains/shifts/types";
import { quickAddTaskSchema, taskSchema } from "@/domains/tasks/types";

// The quick-add rows and duplicating must accept exactly what the full forms accept.
describe("full and short schemas agree", () => {
  const long = "x".repeat(121);
  const start = new Date("2026-02-15T10:00:00Z");
  const before = new Date("2026-02-15T09:00:00Z");

  it("for tasks", () => {
    const task = {
      shiftId: "s1",
      name: long,
      description: "",
      startTime: start,
      requiredParticipants: 0,
    };
    expect(
      taskSchema
        .safeParse(task)
        .error?.issues.map((i) => i.path[0])
        .sort(),
    ).toEqual(["name", "requiredParticipants"]);
    expect(
      quickAddTaskSchema
        .safeParse(task)
        .error?.issues.map((i) => i.path[0])
        .sort(),
    ).toEqual(["name", "requiredParticipants"]);
  });

  it("for shifts", () => {
    const shift = { eventId: "e1", name: "Aufbau", startTime: start, endTime: before };
    expect(shiftSchema.safeParse(shift).error?.issues[0]?.path).toEqual(["endTime"]);
    expect(quickAddShiftSchema.safeParse(shift).error?.issues[0]?.path).toEqual(["endTime"]);
  });

  it("for events", () => {
    const event = {
      eventId: "e1",
      name: "Sommerfest",
      description: "",
      startDate: start,
      endDate: before,
    };
    expect(eventSchema.safeParse(event).error?.issues[0]?.path).toEqual(["endDate"]);
    expect(duplicateEventSchema.safeParse(event).error?.issues[0]?.path).toEqual(["endDate"]);
  });
});
