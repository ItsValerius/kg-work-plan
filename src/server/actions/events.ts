"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { isAdmin } from "@/lib/auth/utils";
import * as domainActions from "@/domains/events/functions";
import type { EventInput } from "@/domains/events/types";
import { revalidatePath } from "next/cache";

export async function createOrUpdateEvent(data: EventInput) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.createOrUpdateEvent(data, userId);
  revalidatePath("/events");
  return result;
}

export async function deleteEvent(eventId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  await domainActions.deleteEvent(eventId);
  revalidatePath("/events");
}

export async function duplicateEvent(
  eventId: string,
  name: string,
  startDate: Date,
  endDate: Date
) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.duplicateEvent(eventId, name, startDate, endDate, userId);
  revalidatePath("/events");
  return result;
}

export async function deleteTask(taskId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  await domainActions.deleteTask(taskId);
  revalidatePath("/events");
}

export async function deleteShift(shiftId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
  const deletedShift = await domainActions.deleteShift(shiftId);
  revalidatePath(`/events/${deletedShift.eventId}`);
}
