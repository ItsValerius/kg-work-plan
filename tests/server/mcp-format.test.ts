import { describe, expect, it } from "vitest";
import type { EventWorkPlan } from "@/domains/events/queries";
import { fromBerlin } from "@/lib/datetime";
import { toWorkPlan } from "@/server/mcp/format";

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
