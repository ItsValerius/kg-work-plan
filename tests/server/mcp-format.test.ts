import { describe, expect, it } from "vitest";
import type { EventWorkPlan } from "@/domains/events/queries";
import { fromBerlin } from "@/lib/datetime";
import { shiftTimes, taskStart, toWorkPlan } from "@/server/mcp/format";

describe("MCP times", () => {
  it("reads input as Berlin wall-clock time", () => {
    const { startTime, endTime } = shiftTimes("2026-11-11", "18:00", "22:00");
    expect(startTime.toISOString()).toBe("2026-11-11T17:00:00.000Z");
    expect(endTime.toISOString()).toBe("2026-11-11T21:00:00.000Z");
  });

  it("ends a night shift on the next day", () => {
    const { endTime } = shiftTimes("2026-11-11", "22:00", "02:00");
    expect(endTime.toISOString()).toBe("2026-11-12T01:00:00.000Z");
  });

  it("uses the summer offset on a DST-change day", () => {
    expect(shiftTimes("2026-03-29", "12:00", "14:00").startTime.toISOString()).toBe(
      "2026-03-29T10:00:00.000Z",
    );
  });

  it("puts a task after midnight on the shift's next day", () => {
    const shiftStart = fromBerlin("2026-11-11", "22:00");
    expect(taskStart(shiftStart, "00:30").toISOString()).toBe("2026-11-11T23:30:00.000Z");
  });
});

describe("MCP work plan", () => {
  const plan = {
    id: "e1",
    name: "Sessionsauftakt",
    description: "",
    startDate: fromBerlin("2026-11-11"),
    endDate: fromBerlin("2026-11-11"),
    shifts: [
      {
        id: "s1",
        name: "Theke",
        startTime: fromBerlin("2026-11-11", "18:00"),
        endTime: fromBerlin("2026-11-11", "23:00"),
        tasks: [
          {
            id: "t1",
            name: "Zapfen",
            description: "",
            startTime: fromBerlin("2026-11-11", "18:00"),
            requiredParticipants: 3,
            participants: [
              {
                groupSize: 2,
                groupName: "Familie Müller",
                user: { name: "Anna", email: "anna@example.com" },
              },
            ],
          },
        ],
      },
    ],
  } as unknown as EventWorkPlan;

  it("shows helpers only as counts", () => {
    const result = toWorkPlan(plan);
    expect(result.shifts[0].tasks[0]).toMatchObject({
      start: "18:00",
      spots: { filled: 2, required: 3, open: 1 },
    });
    const json = JSON.stringify(result);
    expect(json).not.toContain("anna@example.com");
    expect(json).not.toContain("Anna");
    expect(json).not.toContain("Müller");
  });
});
