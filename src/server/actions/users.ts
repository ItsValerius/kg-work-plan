"use server";

import { getAuthenticatedUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/users/functions";
import { idSchema, parseOrThrow } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export async function removeUserFromTask(taskId: string) {
  const userId = await getAuthenticatedUserId();
  await domainActions.removeUserFromTask(parseOrThrow(idSchema, taskId), userId);
  updateTag(WORKPLAN_TAG);
}
