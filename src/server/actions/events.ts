"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { isAdmin } from "@/lib/auth/utils";
import * as domainActions from "@/domains/events/functions";
import type { EventInput } from "@/domains/events/types";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export async function createOrUpdateEvent(data: EventInput) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.createOrUpdateEvent(data, userId);
  updateTag(WORKPLAN_TAG);
  return result;
}

export async function deleteEvent(eventId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  await domainActions.deleteEvent(eventId);
  updateTag(WORKPLAN_TAG);
}

export async function duplicateEvent(
  eventId: string,
  name: string,
  startDate: Date,
  endDate: Date,
) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.duplicateEvent(eventId, name, startDate, endDate, userId);
  updateTag(WORKPLAN_TAG);
  return result;
}

export async function deleteTask(taskId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  await domainActions.deleteTask(taskId);
  updateTag(WORKPLAN_TAG);
}

export async function deleteShift(shiftId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  await domainActions.deleteShift(shiftId);
  updateTag(WORKPLAN_TAG);
}
