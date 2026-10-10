"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/events/functions";
import { duplicateEventSchema, eventSchema, type EventInput } from "@/domains/events/types";
import { firstIssueMessage, idSchema, parseOrThrow } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

/**
 * Saves the event form (create or edit). Returns the reason instead of throwing, because
 * production builds hide thrown server-action messages from the browser.
 */
export async function saveEvent(raw: EventInput): Promise<SaveResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedAdminUserId();
  } catch {
    return { ok: false, error: "Nur Organisatoren können Veranstaltungen speichern." };
  }
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }

  let id: string;
  try {
    id = (await domainActions.createOrUpdateEvent(parsed.data, userId)).id;
  } catch {
    return {
      ok: false,
      error: "Die Veranstaltung konnte nicht gespeichert werden. Bitte versuch es noch einmal.",
    };
  }
  updateTag(WORKPLAN_TAG);
  return { ok: true, id };
}

export async function deleteEvent(eventId: string) {
  await getAuthenticatedAdminUserId();
  await domainActions.deleteEvent(parseOrThrow(idSchema, eventId));
  updateTag(WORKPLAN_TAG);
}

export async function duplicateEvent(
  eventId: string,
  name: string,
  startDate: Date,
  endDate: Date,
) {
  const userId = await getAuthenticatedAdminUserId();
  const input = parseOrThrow(duplicateEventSchema, { eventId, name, startDate, endDate });
  const result = await domainActions.duplicateEvent(
    input.eventId,
    input.name,
    input.startDate,
    input.endDate,
    userId,
  );
  updateTag(WORKPLAN_TAG);
  return result;
}

export async function deleteTask(taskId: string) {
  await getAuthenticatedAdminUserId();
  await domainActions.deleteTask(parseOrThrow(idSchema, taskId));
  updateTag(WORKPLAN_TAG);
}

export async function deleteShift(shiftId: string) {
  await getAuthenticatedAdminUserId();
  await domainActions.deleteShift(parseOrThrow(idSchema, shiftId));
  updateTag(WORKPLAN_TAG);
}
