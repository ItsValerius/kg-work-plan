import { McpServer } from "@modelcontextprotocol/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fromBerlin } from "@/lib/datetime";

// The tools turn an assistant's Berlin day/time strings into shift and task times. The
// database is mocked: each test sets the stored shift and reads what would be saved.
const stored = vi.fn();
const savedShift = vi.fn(async (data: object) => ({ id: "shift-1", ...data }));
const savedTask = vi.fn(async (data: object) => ({ id: "task-1", ...data }));
vi.mock("@/domains/shifts/queries", () => ({ getShiftById: stored }));
vi.mock("@/domains/shifts/functions", () => ({ createOrUpdateShift: savedShift }));
vi.mock("@/domains/tasks/functions", () => ({ createOrUpdateTask: savedTask }));
vi.mock("@/domains/tasks/queries", () => ({ getTaskById: vi.fn() }));
vi.mock("@/domains/events/queries", () => ({}));
vi.mock("@/domains/events/functions", () => ({}));
vi.mock("@/domains/users/queries", () => ({}));
vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

type Handler = (args: Record<string, unknown>) => Promise<{ isError?: boolean }>;
const handlers = new Map<string, Handler>();
vi.spyOn(McpServer.prototype, "registerTool").mockImplementation(((
  name: string,
  _config: unknown,
  handler: Handler,
) => {
  handlers.set(name, handler);
}) as never);
const { buildMcpServer } = await import("@/server/mcp/tools");
buildMcpServer("admin-1");
const call = (tool: string, args: Record<string, unknown>) => handlers.get(tool)!(args);

const nightShift = {
  id: "shift-1",
  eventId: "event-1",
  name: "Nachtschicht",
  startTime: fromBerlin("2026-11-11", "20:00"),
  endTime: fromBerlin("2026-11-12", "02:00"),
};

describe("MCP save_shift", () => {
  beforeEach(() => {
    savedShift.mockClear();
    stored.mockResolvedValue(nightShift);
  });

  it("moves a night shift to another day with its end still after midnight", async () => {
    await call("save_shift", { id: "shift-1", day: "2026-11-12" });
    expect(savedShift).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: fromBerlin("2026-11-12", "20:00"),
        endTime: fromBerlin("2026-11-13", "02:00"),
      }),
      "admin-1",
    );
  });

  it("keeps the end when only the start changes", async () => {
    await call("save_shift", { id: "shift-1", start: "21:00" });
    expect(savedShift).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: fromBerlin("2026-11-11", "21:00"),
        endTime: nightShift.endTime,
      }),
      "admin-1",
    );
  });

  it("refuses a new start after the kept end instead of guessing a day", async () => {
    stored.mockResolvedValue({ ...nightShift, endTime: fromBerlin("2026-11-11", "23:00") });
    const result = await call("save_shift", { id: "shift-1", start: "23:30" });
    expect(result.isError).toBe(true);
    expect(savedShift).not.toHaveBeenCalled();
  });
});

describe("MCP save_task", () => {
  it("places a task after midnight on the night shift's next day", async () => {
    stored.mockResolvedValue(nightShift);
    await call("save_task", {
      shiftId: "shift-1",
      name: "Aufräumen",
      start: "01:00",
      requiredParticipants: 2,
    });
    expect(savedTask).toHaveBeenCalledWith(
      expect.objectContaining({ startTime: fromBerlin("2026-11-12", "01:00") }),
      "admin-1",
    );
  });
});
