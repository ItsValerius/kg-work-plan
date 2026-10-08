"use server";

import { getAuthenticatedAdminUserId, getAuthenticatedUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/participants/functions";
import {
  signUpSchema,
  updateGroupSchema,
  type UpdateGroupData,
} from "@/domains/participants/types";
import { firstIssueMessage, idListSchema, idSchema, parseOrThrow } from "@/lib/validation";
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
    await domainActions.createParticipant(
      { taskId: input.taskId, groupName, groupSize, createdById: userId },
      userId,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Benutzer bereits zur Aufgabe eingetragen.") {
      return { ok: false, error: "Du bist bei dieser Aufgabe schon eingetragen." };
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

export async function updateGroup(data: UpdateGroupData) {
  const userId = await getAuthenticatedUserId();
  const result = await domainActions.updateGroup(parseOrThrow(updateGroupSchema, data), userId);
  updateTag(WORKPLAN_TAG);
  return result;
}

export async function removeUserFromTaskAction(selectedRowIds: string[]) {
  const userId = await getAuthenticatedAdminUserId();
  await domainActions.removeUserFromTaskAction(parseOrThrow(idListSchema, selectedRowIds), userId);
  updateTag(WORKPLAN_TAG);
}

export async function removeParticipant(participantId: string) {
  const userId = await getAuthenticatedUserId();
  await domainActions.removeParticipant(parseOrThrow(idSchema, participantId), userId);
  updateTag(WORKPLAN_TAG);
}
