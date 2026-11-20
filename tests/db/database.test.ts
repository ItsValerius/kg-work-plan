// Runs against the docker-compose database through the local wsproxy: pnpm test:db
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { config } from "dotenv";
import { eq, ilike, like } from "drizzle-orm";

config({ path: ".env.local", quiet: true });

type Mail = { to: string };
const sendMail = vi.hoisted(() =>
  vi.fn<(mail: Mail) => Promise<{ rejected: string[] }>>(async () => ({ rejected: [] })),
);
vi.mock("nodemailer", () => ({ createTransport: () => ({ sendMail }) }));
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
vi.mock("next/server", () => ({ connection: vi.fn() }));

const { default: db } = await import("@/db");
const { events, shifts, tasks, taskParticipants, users, verification } =
  await import("@/db/schema");
const { createParticipant, updateGroup, CapacityError } =
  await import("@/domains/participants/functions");
const { createOrUpdateEvent } = await import("@/domains/events/functions");
const { auth } = await import("@/lib/auth/auth");

const prefix = `dbtest-${Date.now()}`;
const day = 86_400_000;
const hour = 3_600_000;
// Whole minutes, as the forms store them.
const start = new Date(Math.floor((Date.now() + 30 * day) / 60_000) * 60_000);
const eventId = `${prefix}-event`;
const shiftId = `${prefix}-shift`;
const taskId = `${prefix}-task`;
const userIds = Array.from({ length: 6 }, (_, i) => `${prefix}-user${i}`);

const fulfilled = (results: PromiseSettledResult<unknown>[]) =>
  results.filter((r) => r.status === "fulfilled").length;
const pgCode = (error: unknown) => (error as { cause?: { code?: string } }).cause?.code;

beforeAll(async () => {
  await db
    .insert(users)
    .values(userIds.map((id) => ({ id, email: `${id}@example.org`, name: id })));
  await db.insert(events).values({
    id: eventId,
    name: prefix,
    description: "",
    startDate: start,
    endDate: new Date(+start + 2 * day),
    createdById: userIds[0],
  });
  await db.insert(shifts).values({
    id: shiftId,
    eventId,
    name: "Schicht",
    startTime: new Date(+start + hour),
    endTime: new Date(+start + 4 * hour),
    createdById: userIds[0],
  });
  await db.insert(tasks).values({
    id: taskId,
    shiftId,
    name: "Aufgabe",
    description: "",
    requiredParticipants: 4,
    startTime: new Date(+start + hour),
    createdById: userIds[0],
  });
});

afterAll(async () => {
  await db.delete(events).where(eq(events.id, eventId));
  await db.delete(users).where(like(users.id, `${prefix}%`));
  await db.delete(verification).where(ilike(verification.value, `%${prefix}%`));
});

describe("Teilnahme", () => {
  it("überbucht nicht, wenn sich viele gleichzeitig eintragen", async () => {
    const results = await Promise.allSettled(
      userIds.map((userId) => createParticipant({ taskId, groupSize: 1 }, userId)),
    );
    expect(fulfilled(results)).toBe(4);
  });

  it("überbucht nicht, wenn zwei Gruppen gleichzeitig wachsen", async () => {
    const [a, b, ...rest] = await db
      .select()
      .from(taskParticipants)
      .where(eq(taskParticipants.taskId, taskId));
    for (const p of rest) await db.delete(taskParticipants).where(eq(taskParticipants.id, p.id));

    const results = await Promise.allSettled([
      updateGroup({ participantId: a.id, groupSize: 3 }, a.userId!),
      updateGroup({ participantId: b.id, groupSize: 3 }, b.userId!),
    ]);
    expect(fulfilled(results)).toBe(1);
    expect(results.find((r) => r.status === "rejected")).toMatchObject({
      reason: expect.any(CapacityError),
    });
    const after = await db
      .select()
      .from(taskParticipants)
      .where(eq(taskParticipants.taskId, taskId));
    expect(after.reduce((sum, p) => sum + p.groupSize, 0)).toBe(4);
  });

  it("lässt niemanden die Gruppe eines anderen ändern", async () => {
    const [a] = await db.select().from(taskParticipants).where(eq(taskParticipants.taskId, taskId));
    const other = userIds.find((id) => id !== a.userId)!;
    await expect(updateGroup({ participantId: a.id, groupName: "x" }, other)).rejects.toThrow(
      "Unauthorized",
    );
  });
});

describe("Datenbankregeln", () => {
  it("lehnt Aufgaben ohne Plätze und Schichten ohne Dauer ab", async () => {
    const task = await db
      .update(tasks)
      .set({ requiredParticipants: 0 })
      .where(eq(tasks.id, taskId))
      .catch((e: unknown) => e);
    expect(pgCode(task)).toBe("23514");
    const shift = await db
      .update(shifts)
      .set({ endTime: start })
      .where(eq(shifts.id, shiftId))
      .catch((e: unknown) => e);
    expect(pgCode(shift)).toBe("23514");
  });
});

describe("Veranstaltung verschieben", () => {
  it("lässt Schichten passend zur zuletzt gespeicherten Veranstaltung, auch bei gleichzeitigem Speichern", async () => {
    const [event] = await db.select().from(events).where(eq(events.id, eventId));
    const [shift] = await db.select().from(shifts).where(eq(shifts.id, shiftId));
    const offset = +shift.startTime - +event.startDate;
    const movedBy = (days: number) => ({
      id: eventId,
      name: prefix,
      description: "",
      startDate: new Date(+event.startDate + days * day),
      endDate: new Date(+event.endDate + days * day),
    });

    await Promise.all([
      createOrUpdateEvent(movedBy(1), userIds[0]),
      createOrUpdateEvent(movedBy(3), userIds[1]),
    ]);

    const [savedEvent] = await db.select().from(events).where(eq(events.id, eventId));
    const [savedShift] = await db.select().from(shifts).where(eq(shifts.id, shiftId));
    expect(+savedShift.startTime - +savedEvent.startDate).toBe(offset);
  });
});

describe("Anmeldelinks", () => {
  it("schickt pro Adresse höchstens einen Link pro Minute, unabhängig von Groß- und Kleinschreibung", async () => {
    const request = (email: string) =>
      auth.api.signInMagicLink({ body: { email, callbackURL: "/" }, headers: new Headers() });
    const email = `${prefix}-magic@example.org`;

    await request(email);
    await request(email.toUpperCase());
    await request(`${prefix}_magic@example.org`); // "_" is no LIKE wildcard here

    expect(sendMail.mock.calls.map(([mail]) => mail.to)).toEqual([
      email,
      `${prefix}_magic@example.org`,
    ]);
  });
});
