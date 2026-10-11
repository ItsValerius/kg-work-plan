"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/shifts/functions";
import { SHIFT_OUTSIDE_EVENT } from "@/domains/shifts/days";
import { quickAddShiftSchema, shiftSchema, type ShiftInput } from "@/domains/shifts/types";
import { type ActionResult, firstIssueMessage } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import type { SaveResult } from "./events";

/** Adds a shift from the organizer's planning view. */
export async function quickAddShift(raw: {
  eventId: string;
  name: string;
  startTime: Date;
  endTime: Date;
}): Promise<ActionResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedAdminUserId();
  } catch {
    return { ok: false, error: "Nur Organisatoren können Schichten anlegen." };
  }

  const parsed = quickAddShiftSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }
  const input = parsed.data;

  try {
    await domainActions.createOrUpdateShift(
      {
        eventId: input.eventId,
        name: input.name,
        startTime: input.startTime,
        endTime: input.endTime,
        createdById: userId,
      },
      userId,
    );
  } catch (error) {
    if (error instanceof Error && error.message === SHIFT_OUTSIDE_EVENT) {
      return { ok: false, error: SHIFT_OUTSIDE_EVENT };
    }
    return {
      ok: false,
      error: "Die Schicht konnte nicht gespeichert werden. Bitte versuche es noch einmal.",
    };
  }

  updateTag(WORKPLAN_TAG);
  return { ok: true };
}

/** Saves the shift form (create or edit). */
export async function saveShift(raw: ShiftInput): Promise<SaveResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedAdminUserId();
  } catch {
    return { ok: false, error: "Nur Organisatoren können Schichten speichern." };
  }
  const parsed = shiftSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }

  let id: string;
  try {
    id = (await domainActions.createOrUpdateShift(parsed.data, userId)).id;
  } catch (error) {
    if (error instanceof Error && error.message === SHIFT_OUTSIDE_EVENT) {
      return { ok: false, error: SHIFT_OUTSIDE_EVENT };
    }
    return {
      ok: false,
      error: "Die Schicht konnte nicht gespeichert werden. Bitte versuch es noch einmal.",
    };
  }
  updateTag(WORKPLAN_TAG);
  return { ok: true, id };
}
