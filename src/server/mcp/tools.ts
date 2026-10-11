import { McpServer } from "@modelcontextprotocol/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import * as eventFunctions from "@/domains/events/functions";
import {
  getEventById,
  getEventWorkPlan,
  getFutureEvents,
  getMissingUsersPerEvents,
  getPastEvents,
} from "@/domains/events/queries";
import { duplicateEventSchema, eventSchema } from "@/domains/events/types";
import { SHIFT_OUTSIDE_EVENT, SHIFTS_OUTSIDE_EVENT } from "@/domains/shifts/days";
import { createOrUpdateShift } from "@/domains/shifts/functions";
import { getShiftById } from "@/domains/shifts/queries";
import { shiftSchema } from "@/domains/shifts/types";
import { createOrUpdateTask } from "@/domains/tasks/functions";
import { getTaskById } from "@/domains/tasks/queries";
import { taskSchema } from "@/domains/tasks/types";
import { getUserName } from "@/domains/users/queries";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import {
  berlinDaysBetween,
  berlinTimeFrom,
  fromBerlin,
  moveByBerlinDays,
  toBerlinInputParts,
} from "@/lib/datetime";
import { logger } from "@/lib/logger";
import { firstIssueMessage, idSchema } from "@/lib/validation";
import { toEventSummary, toWorkPlan } from "./format";

/*
  The tools an admin's AI assistant gets at /api/mcp. Reads and create/edit only: no
  deletes, no helper names or emails. Every write goes through the same domain schema
  and function as the organizer forms.
*/

// Real calendar days and clock times only: "2026-02-30" would otherwise roll over to March.
const daySchema = z.iso.date().describe("Calendar day in Europe/Berlin, YYYY-MM-DD");
const timeSchema = z.iso
  .time({ precision: -1 })
  .describe("Wall-clock time in Europe/Berlin, HH:MM (24h)");

const INSTRUCTIONS = `Work plan of a carnival club (Karnevalsgesellschaft): events contain shifts, shifts contain tasks that volunteers sign up for.
All days and times are Europe/Berlin wall-clock values; never convert them to UTC.
Volunteers are shown only as counts (filled/required/open spots). Nothing can be deleted here; deleting and removing volunteers happens in the web app under /organisation.
To edit, pass the id and only the fields that change. Reply to the user in German.`;

const readOnly = { readOnlyHint: true, openWorldHint: false };
const write = { readOnlyHint: false, destructiveHint: false, openWorldHint: false };
// ChatGPT reads per-tool auth requirements from here.
const _meta = { securitySchemes: [{ type: "oauth2" }] };

function ok(data: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data) }],
    structuredContent: data,
  };
}

function fail(message: string) {
  return { isError: true, content: [{ type: "text" as const, text: message }] };
}

/** Runs a domain write; refreshes the cached pages afterwards, hides internal errors. */
async function save<T>(
  tool: string,
  run: () => Promise<T>,
  done: (saved: T) => Record<string, unknown>,
) {
  try {
    const saved = await run();
    revalidateTag(WORKPLAN_TAG, { expire: 0 });
    return ok(done(saved));
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === SHIFT_OUTSIDE_EVENT || message === SHIFTS_OUTSIDE_EVENT) return fail(message);
    logger.error("MCP write failed", error, { tool });
    return fail("Das Speichern hat nicht geklappt. Bitte versuche es noch einmal.");
  }
}

export function buildMcpServer(userId: string) {
  const server = new McpServer(
    { name: "kg-arbeitsplan", version: "1.0.0" },
    { instructions: INSTRUCTIONS },
  );

  // ChatGPT labels a connected account with this ("Primary" without it). Name only: no
  // email, as the privacy notice promises.
  server.registerTool(
    "get_profile",
    {
      title: "Profil",
      description:
        "Return the profile of the signed-in organizer. The opaque id is unique within this app and stays the same across token refresh, reconnection and name changes.",
      inputSchema: z.object({}).strict(),
      outputSchema: z
        .object({
          id: z.string().min(1).regex(/\S/),
          name: z.string().optional(),
          nickname: z.string().optional(),
        })
        .strict(),
      annotations: { ...readOnly, destructiveHint: false },
      _meta: { ..._meta, "openai/profile": true },
    },
    async () => {
      const name = (await getUserName(userId))?.trim();
      return ok({
        id: userId,
        ...(name ? { name, nickname: `${name} · KG Arbeitsplan` } : {}),
      });
    },
  );

  server.registerTool(
    "list_events",
    {
      title: "Veranstaltungen auflisten",
      description: "List upcoming or past events with their ids, days and open spots.",
      inputSchema: z.object({ when: z.enum(["upcoming", "past"]).default("upcoming") }),
      annotations: readOnly,
      _meta,
    },
    async ({ when }) => {
      const events = when === "past" ? await getPastEvents() : await getFutureEvents();
      const counts = await getMissingUsersPerEvents(events.map((event) => event.id));
      return ok({ events: events.map((event) => toEventSummary(event, counts[event.id])) });
    },
  );

  server.registerTool(
    "get_work_plan",
    {
      title: "Arbeitsplan ansehen",
      description:
        "An event's shifts and tasks with times and filled/required/open spots per task, shift and event.",
      inputSchema: z.object({ eventId: idSchema }),
      annotations: readOnly,
      _meta,
    },
    async ({ eventId }) => {
      const plan = await getEventWorkPlan(eventId);
      return plan ? ok(toWorkPlan(plan)) : fail("Diese Veranstaltung gibt es nicht.");
    },
  );

  server.registerTool(
    "save_event",
    {
      title: "Veranstaltung speichern",
      description:
        "Create an event (name and startDay required; endDay defaults to startDay) or edit one by id. Moving an event's start moves its end (unless endDay is given), shifts and tasks by the same number of days.",
      inputSchema: z.object({
        id: idSchema.optional().describe("Set to edit an existing event"),
        name: z.string().optional(),
        description: z.string().optional(),
        startDay: daySchema.optional(),
        endDay: daySchema.optional(),
      }),
      annotations: write,
      _meta,
    },
    async ({ id, name, description, startDay, endDay }) => {
      const existing = id ? await getEventById(id) : undefined;
      if (id && !existing) return fail("Diese Veranstaltung gibt es nicht.");
      if (!existing && (!name || !startDay)) {
        return fail("Für eine neue Veranstaltung brauche ich Name und Starttag.");
      }
      const startDate = startDay ? fromBerlin(startDay) : existing!.startDate;
      const parsed = eventSchema.safeParse({
        id,
        name: name ?? existing?.name,
        description: description ?? existing?.description ?? "",
        startDate,
        // Without a new end, a moved event keeps its length, like duplicate_event.
        endDate: endDay
          ? fromBerlin(endDay)
          : existing
            ? moveByBerlinDays(existing.endDate, berlinDaysBetween(existing.startDate, startDate))
            : startDate,
        createdById: userId,
      });
      if (!parsed.success) return fail(firstIssueMessage(parsed.error));
      return save(
        "save_event",
        () => eventFunctions.createOrUpdateEvent(parsed.data, userId),
        (event) => ({ event: toEventSummary(event) }),
      );
    },
  );

  server.registerTool(
    "save_shift",
    {
      title: "Schicht speichern",
      description:
        "Create a shift in an event (eventId, name, day, start, end required) or edit one by id. An end before the start means the shift ends after midnight. Changing only the start keeps the end. Moving a shift to another day moves its tasks along; it can't move to another event.",
      inputSchema: z.object({
        id: idSchema.optional().describe("Set to edit an existing shift"),
        eventId: idSchema.optional().describe("Required for a new shift"),
        name: z.string().optional(),
        day: daySchema.optional(),
        start: timeSchema.optional(),
        end: timeSchema.optional(),
      }),
      annotations: write,
      _meta,
    },
    async ({ id, eventId, name, day, start, end }) => {
      const existing = id ? await getShiftById(id) : undefined;
      if (id && !existing) return fail("Diese Schicht gibt es nicht.");
      if (existing && eventId && eventId !== existing.eventId) {
        return fail("Schichten lassen sich nicht in eine andere Veranstaltung verschieben.");
      }
      if (!existing) {
        if (!eventId || !name || !day || !start || !end) {
          return fail(
            "Für eine neue Schicht brauche ich Veranstaltung, Name, Tag, Beginn und Ende.",
          );
        }
        if (!(await getEventById(eventId))) return fail("Diese Veranstaltung gibt es nicht.");
      }
      const current = existing && toBerlinInputParts(existing.startTime);
      const startTime = fromBerlin(day ?? current!.day, start ?? current!.time);
      // A new end, or a move to another day, is placed after the start (night shifts end
      // the next day). A new start alone keeps the end, so 18–23 → 23:30 is refused
      // instead of becoming a shift until 23:00 the next day.
      const endTime =
        end || day
          ? berlinTimeFrom(startTime, end ?? toBerlinInputParts(existing!.endTime).time)
          : existing!.endTime;
      const parsed = shiftSchema.safeParse({
        id,
        eventId: existing?.eventId ?? eventId,
        name: name ?? existing?.name,
        startTime,
        endTime,
        createdById: userId,
      });
      if (!parsed.success) return fail(firstIssueMessage(parsed.error));
      return save(
        "save_shift",
        () => createOrUpdateShift(parsed.data, userId),
        (shift) => ({
          shift: {
            id: shift.id,
            name: shift.name,
            day: toBerlinInputParts(shift.startTime).day,
            start: toBerlinInputParts(shift.startTime).time,
            end: toBerlinInputParts(shift.endTime).time,
          },
        }),
      );
    },
  );

  server.registerTool(
    "save_task",
    {
      title: "Aufgabe speichern",
      description:
        "Create a task in a shift (shiftId, name, requiredParticipants required; start defaults to the shift's start) or edit one by id. A task can't move to another shift.",
      inputSchema: z.object({
        id: idSchema.optional().describe("Set to edit an existing task"),
        shiftId: idSchema.optional().describe("Required for a new task"),
        name: z.string().optional(),
        description: z.string().optional(),
        start: timeSchema.optional().describe("Start within the shift, HH:MM Europe/Berlin"),
        requiredParticipants: z.number().int().optional().describe("How many people are needed"),
      }),
      annotations: write,
      _meta,
    },
    async ({ id, shiftId, name, description, start, requiredParticipants }) => {
      const existing = id ? await getTaskById(id) : undefined;
      if (id && !existing) return fail("Diese Aufgabe gibt es nicht.");
      if (existing && shiftId && shiftId !== existing.shiftId) {
        return fail("Aufgaben lassen sich nicht in eine andere Schicht verschieben.");
      }
      if (!existing && (!shiftId || !name || requiredParticipants === undefined)) {
        return fail("Für eine neue Aufgabe brauche ich Schicht, Name und Anzahl Personen.");
      }
      const shift = await getShiftById(existing?.shiftId ?? shiftId!);
      if (!shift) return fail("Diese Schicht gibt es nicht.");
      const parsed = taskSchema.safeParse({
        id,
        shiftId: shift.id,
        name: name ?? existing?.name,
        description: description ?? existing?.description ?? "",
        // A task may start after midnight in a night shift, on the shift's next day.
        startTime: start
          ? berlinTimeFrom(shift.startTime, start)
          : (existing?.startTime ?? shift.startTime),
        requiredParticipants: requiredParticipants ?? existing?.requiredParticipants,
        createdById: userId,
      });
      if (!parsed.success) return fail(firstIssueMessage(parsed.error));
      return save(
        "save_task",
        () => createOrUpdateTask(parsed.data, userId),
        (task) => ({
          task: {
            id: task.id,
            name: task.name,
            day: toBerlinInputParts(task.startTime).day,
            start: toBerlinInputParts(task.startTime).time,
            requiredParticipants: task.requiredParticipants,
          },
        }),
      );
    },
  );

  server.registerTool(
    "duplicate_event",
    {
      title: "Veranstaltung kopieren",
      description:
        "Copy an event with all its shifts and tasks (no sign-ups) to a new start day; every clock time is kept. endDay defaults to keeping the original length.",
      inputSchema: z.object({
        eventId: idSchema,
        name: z.string(),
        startDay: daySchema,
        endDay: daySchema.optional(),
      }),
      annotations: write,
      _meta,
    },
    async ({ eventId, name, startDay, endDay }) => {
      const original = await getEventById(eventId);
      if (!original) return fail("Diese Veranstaltung gibt es nicht.");
      const startDate = fromBerlin(startDay);
      const parsed = duplicateEventSchema.safeParse({
        eventId,
        name,
        startDate,
        endDate: endDay
          ? fromBerlin(endDay)
          : moveByBerlinDays(original.endDate, berlinDaysBetween(original.startDate, startDate)),
      });
      if (!parsed.success) return fail(firstIssueMessage(parsed.error));
      const input = parsed.data;
      return save(
        "duplicate_event",
        () =>
          eventFunctions.duplicateEvent(
            input.eventId,
            input.name,
            input.startDate,
            input.endDate,
            userId,
          ),
        (newEventId) => ({ eventId: newEventId }),
      );
    },
  );

  return server;
}
