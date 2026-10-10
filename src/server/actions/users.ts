"use server";

import { getAuthenticatedUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/users/functions";
import { SHIFT_OVER } from "@/domains/participants/functions";
import { idSchema } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export type RemoveUserFromTaskResult = { ok: true } | { ok: false; error: string };

/**
 * A helper signs themselves off a task. Returns the reason instead of throwing, because
 * production builds hide thrown server-action messages from the browser.
 */
export async function removeUserFromTask(taskId: string): Promise<RemoveUserFromTaskResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedUserId();
  } catch {
    return { ok: false, error: "Bitte melde dich zuerst an." };
  }
  const parsed = idSchema.safeParse(taskId);
  if (!parsed.success) {
    return { ok: false, error: "Diese Aufgabe gibt es nicht." };
  }

  try {
    await domainActions.removeUserFromTask(parsed.data, userId);
  } catch (error) {
    if (error instanceof Error && error.message === SHIFT_OVER) {
      return { ok: false, error: `${SHIFT_OVER} Wende dich an die Organisation.` };
    }
    return { ok: false, error: "Das Austragen hat nicht geklappt. Bitte versuche es noch einmal." };
  }

  updateTag(WORKPLAN_TAG);
  return { ok: true };
}
