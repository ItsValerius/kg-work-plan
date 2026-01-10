"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/tasks/functions";
import type { TaskInput } from "@/domains/tasks/types";
import { revalidatePath } from "next/cache";

export async function createOrUpdateTask(data: TaskInput) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.createOrUpdateTask(data, userId);
  revalidatePath("/events");
  return result;
}
