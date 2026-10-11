"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/events/functions";
import { duplicateEventSchema, eventSchema, type EventInput } from "@/domains/events/types";
import { firstIssueMessage, idSchema, parseOrThrow } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import { SHIFTS_OUTSIDE_EVENT } from "@/domains/shifts/days";

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

/** Saves the event form (create or edit). */
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
  } catch (error) {
    if (error instanceof Error && error.message === SHIFTS_OUTSIDE_EVENT) {
      return { ok: false, error: SHIFTS_OUTSIDE_EVENT };
    }
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

/** Copies an event with its shifts and tasks. */
export async function duplicateEvent(
  eventId: string,
  name: string,
  startDate: Date,
  endDate: Date,
): Promise<SaveResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedAdminUserId();
  } catch {
    return { ok: false, error: "Nur Organisatoren können Veranstaltungen kopieren." };
  }
  const parsed = duplicateEventSchema.safeParse({ eventId, name, startDate, endDate });
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }
  const input = parsed.data;

  let id: string;
  try {
    id = await domainActions.duplicateEvent(
      input.eventId,
      input.name,
      input.startDate,
      input.endDate,
      userId,
    );
  } catch (error) {
    if (error instanceof Error && error.message === SHIFTS_OUTSIDE_EVENT) {
      return { ok: false, error: SHIFTS_OUTSIDE_EVENT };
    }
    return { ok: false, error: "Fehler beim Duplizieren der Veranstaltung" };
  }
  updateTag(WORKPLAN_TAG);
  return { ok: true, id };
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
