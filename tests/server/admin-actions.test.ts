import { beforeEach, describe, expect, it, vi } from "vitest";

// Server actions are public endpoints: each admin-only one must check the role itself.
// The domain layer is mocked, so a call that reaches it means the check let it through.
const isAdmin = vi.fn<() => boolean>();
vi.mock("@/lib/auth/utils", () => ({
  getAuthenticatedUserId: async () => "helper-1",
  getAuthenticatedAdminUserId: async () => {
    if (!isAdmin()) throw new Error("Unauthorized");
    return "admin-1";
  },
}));
vi.mock("next/cache", () => ({ updateTag: vi.fn() }));

const domain = {
  createOrUpdateEvent: vi.fn(async () => ({ id: "event-1" })),
  deleteEvent: vi.fn(),
  duplicateEvent: vi.fn(async () => "event-2"),
  deleteTask: vi.fn(),
  deleteShift: vi.fn(),
  createOrUpdateShift: vi.fn(async () => ({ id: "shift-1" })),
  createOrUpdateTask: vi.fn(async () => ({ id: "task-1" })),
  removeUserFromTaskAction: vi.fn(),
};
vi.mock("@/domains/events/functions", () => domain);
vi.mock("@/domains/shifts/functions", () => domain);
vi.mock("@/domains/tasks/functions", () => domain);
vi.mock("@/domains/participants/functions", () => ({
  ...domain,
  ALREADY_SIGNED_UP: "",
  SHIFT_OVER: "",
}));

const events = await import("@/server/actions/events");
const shifts = await import("@/server/actions/shifts");
const tasks = await import("@/server/actions/tasks");
const participants = await import("@/server/actions/participants");

const start = new Date("2026-11-11T17:00:00Z");
const end = new Date("2026-11-11T21:00:00Z");
const event = { name: "Biwak", description: "", startDate: start, endDate: end };
const shift = { eventId: "event-1", name: "Aufbau", startTime: start, endTime: end };
const task = { shiftId: "shift-1", name: "Theke", startTime: start, requiredParticipants: 2 };

const adminActions: [string, () => Promise<unknown>][] = [
  ["saveEvent", () => events.saveEvent(event)],
  ["deleteEvent", () => events.deleteEvent("event-1")],
  ["duplicateEvent", () => events.duplicateEvent("event-1", "Kopie", start, end)],
  ["deleteShift", () => events.deleteShift("shift-1")],
  ["deleteTask", () => events.deleteTask("task-1")],
  ["saveShift", () => shifts.saveShift(shift)],
  ["quickAddShift", () => shifts.quickAddShift(shift)],
  ["saveTask", () => tasks.saveTask({ ...task, description: "" })],
  ["quickAddTask", () => tasks.quickAddTask(task)],
  ["removeUserFromTaskAction", () => participants.removeUserFromTaskAction(["p-1"])],
];
const reachedDomain = () => Object.values(domain).some((fn) => fn.mock.calls.length > 0);

describe("admin-only server actions", () => {
  beforeEach(() => Object.values(domain).forEach((fn) => fn.mockClear()));

  it.each(adminActions)("%s refuses signed-in helpers", async (_name, run) => {
    isAdmin.mockReturnValue(false);
    const result = await run().catch((error: unknown) => error);
    expect(result instanceof Error || (result as { ok?: boolean }).ok === false).toBe(true);
    expect(reachedDomain()).toBe(false);
  });

  it.each(adminActions)("%s lets admins through", async (_name, run) => {
    isAdmin.mockReturnValue(true);
    await run();
    expect(reachedDomain()).toBe(true);
  });
});
