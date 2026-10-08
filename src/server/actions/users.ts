"use server";

import { getAuthenticatedUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/users/functions";
import { userUpdateSchema } from "@/domains/users/types";
import { idSchema, parseOrThrow } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export async function removeUserFromTask(taskId: string) {
  const userId = await getAuthenticatedUserId();
  await domainActions.removeUserFromTask(parseOrThrow(idSchema, taskId), userId);
  updateTag(WORKPLAN_TAG);
}

export async function updateUserProfile(userId: string, name: string) {
  const authenticatedUserId = await getAuthenticatedUserId();
  const input = parseOrThrow(userUpdateSchema, { id: userId, name });
  const result = await domainActions.updateUserProfile(input.id, input.name, authenticatedUserId);
  updateTag(WORKPLAN_TAG);
  return result;
}
