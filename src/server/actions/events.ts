"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { isAdmin } from "@/lib/auth/utils";
import * as domainActions from "@/domains/events/functions";
import { duplicateEventSchema, eventSchema, type EventInput } from "@/domains/events/types";
import { idSchema, parseOrThrow } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export async function createOrUpdateEvent(data: EventInput) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.createOrUpdateEvent(parseOrThrow(eventSchema, data), userId);
  updateTag(WORKPLAN_TAG);
  return result;
}

export async function deleteEvent(eventId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  await domainActions.deleteEvent(parseOrThrow(idSchema, eventId));
  updateTag(WORKPLAN_TAG);
}

export async function duplicateEvent(
  eventId: string,
  name: string,
  startDate: Date,
  endDate: Date,
) {
  const userId = await getAuthenticatedAdminUserId();
  const input = parseOrThrow(duplicateEventSchema, { eventId, name, startDate, endDate });
  const result = await domainActions.duplicateEvent(
    input.eventId,
    input.name,
    input.startDate,
    input.endDate,
    userId,
  );
  updateTag(WORKPLAN_TAG);
  return result;
}

export async function deleteTask(taskId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  await domainActions.deleteTask(parseOrThrow(idSchema, taskId));
  updateTag(WORKPLAN_TAG);
}

export async function deleteShift(shiftId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  await domainActions.deleteShift(parseOrThrow(idSchema, shiftId));
  updateTag(WORKPLAN_TAG);
}
