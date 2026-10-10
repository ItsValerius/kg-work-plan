"use server";

import { getAuthenticatedAdminUserId, getAuthenticatedUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/participants/functions";
import { ALREADY_SIGNED_UP, SHIFT_OVER } from "@/domains/participants/functions";
import {
  signUpSchema,
  updateGroupSchema,
  type UpdateGroupData,
} from "@/domains/participants/types";
import { firstIssueMessage, idListSchema, parseOrThrow } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export type SignUpResult = { ok: true } | { ok: false; error: string };

/**
 * Sign-up from the event sheet. Returns the reason instead of throwing, because
 * production builds hide thrown server-action messages from the browser.
 */
export async function signUpForTask(raw: {
  taskId: string;
  groupName?: string;
  groupSize?: number;
}): Promise<SignUpResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedUserId();
  } catch {
    return { ok: false, error: "Bitte melde dich zuerst an." };
  }

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }
  const input = parsed.data;
  const groupName = input.groupName || undefined;
  const groupSize = input.groupSize;

  try {
    await domainActions.createParticipant({ taskId: input.taskId, groupName, groupSize }, userId);
  } catch (error) {
    if (error instanceof Error && error.message === ALREADY_SIGNED_UP) {
      return { ok: false, error: "Du bist bei dieser Aufgabe schon eingetragen." };
    }
    if (error instanceof Error && error.message === SHIFT_OVER) {
      return { ok: false, error: SHIFT_OVER };
    }
    if (error instanceof Error && error.message.startsWith("Die Mitgliederanzahl")) {
      return {
        ok: false,
        error: "So viele Plätze sind nicht mehr frei. Wähle eine kleinere Gruppe.",
      };
    }
    return { ok: false, error: "Das Eintragen hat nicht geklappt. Bitte versuche es noch einmal." };
  }

  updateTag(WORKPLAN_TAG);
  return { ok: true };
}

export type UpdateGroupResult = { ok: true } | { ok: false; error: string };

/** A helper changes their group; returns the reason on failure, like signUpForTask. */
export async function updateGroup(data: UpdateGroupData): Promise<UpdateGroupResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedUserId();
  } catch {
    return { ok: false, error: "Bitte melde dich zuerst an." };
  }
  const parsed = updateGroupSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }

  try {
    await domainActions.updateGroup(parsed.data, userId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === SHIFT_OVER) {
      return { ok: false, error: `${SHIFT_OVER} Wende dich an die Organisation.` };
    }
    if (message.startsWith("Die neue Gruppengröße")) {
      return { ok: false, error: message };
    }
    return {
      ok: false,
      error: "Die Gruppe konnte nicht gespeichert werden. Bitte versuche es noch einmal.",
    };
  }

  updateTag(WORKPLAN_TAG);
  return { ok: true };
}

export async function removeUserFromTaskAction(selectedRowIds: string[]) {
  const userId = await getAuthenticatedAdminUserId();
  await domainActions.removeUserFromTaskAction(parseOrThrow(idListSchema, selectedRowIds), userId);
  updateTag(WORKPLAN_TAG);
}
