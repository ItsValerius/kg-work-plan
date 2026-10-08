"use server";

import { getAuthenticatedUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/users/functions";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export async function removeUserFromTask(taskId: string) {
  const userId = await getAuthenticatedUserId();
  await domainActions.removeUserFromTask(taskId, userId);
  updateTag(WORKPLAN_TAG);
}

export async function updateUserProfile(userId: string, name: string) {
  const authenticatedUserId = await getAuthenticatedUserId();
  const result = await domainActions.updateUserProfile(userId, name, authenticatedUserId);
  updateTag(WORKPLAN_TAG);
  return result;
}
