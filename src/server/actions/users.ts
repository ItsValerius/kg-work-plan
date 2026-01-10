"use server";

import { getAuthenticatedUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/users/functions";
import { revalidatePath } from "next/cache";

export async function removeUserFromTask(taskId: string) {
  const userId = await getAuthenticatedUserId();
  await domainActions.removeUserFromTask(taskId, userId);
  revalidatePath("/profile");
}

export async function updateUserProfile(userId: string, name: string) {
  const authenticatedUserId = await getAuthenticatedUserId();
  const result = await domainActions.updateUserProfile(userId, name, authenticatedUserId);
  revalidatePath("/profile");
  return result;
}
