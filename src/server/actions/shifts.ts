"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/shifts/functions";
import type { ShiftInput } from "@/domains/shifts/types";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export async function createOrUpdateShift(data: ShiftInput) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.createOrUpdateShift(data, userId);
  updateTag(WORKPLAN_TAG);
  return result;
}

export type QuickAddShiftResult = { ok: true } | { ok: false; error: string };

/**
 * Adds a shift from the organizer's planning view. Validation problems come back as
 * data, because production builds hide thrown server-action messages.
 */
export async function quickAddShift(input: {
  eventId: string;
  name: string;
  startTime: Date;
  endTime: Date;
}): Promise<QuickAddShiftResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedAdminUserId();
  } catch {
    return { ok: false, error: "Nur Organisatoren können Schichten anlegen." };
  }

  const name = input.name.trim();
  const start = new Date(input.startTime);
  const end = new Date(input.endTime);
  if (!name) return { ok: false, error: "Bitte gib der Schicht einen Namen." };
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, error: "Bitte gib gültige Uhrzeiten an." };
  }
  if (end <= start) return { ok: false, error: "Das Ende muss nach dem Beginn liegen." };

  try {
    await domainActions.createOrUpdateShift(
      { eventId: input.eventId, name, startTime: start, endTime: end, createdById: userId },
      userId,
    );
  } catch {
    return {
      ok: false,
      error: "Die Schicht konnte nicht gespeichert werden. Bitte versuche es noch einmal.",
    };
  }

  updateTag(WORKPLAN_TAG);
  return { ok: true };
}
