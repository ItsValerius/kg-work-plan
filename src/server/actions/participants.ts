"use server";

import { getAuthenticatedUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/participants/functions";
import type { ParticipantInput, UpdateGroupData } from "@/domains/participants/types";
import { revalidatePath } from "next/cache";

export async function createParticipant(data: ParticipantInput) {
  const userId = await getAuthenticatedUserId();
  const result = await domainActions.createParticipant(data, userId);
  revalidatePath("/events");
  return result;
}

export async function updateGroup(data: UpdateGroupData) {
  const userId = await getAuthenticatedUserId();
  const result = await domainActions.updateGroup(data, userId);
  revalidatePath("/meine-aufgaben");
  revalidatePath("/events");
  return result;
}

export async function removeUserFromTaskAction(selectedRowIds: string[]) {
  const userId = await getAuthenticatedUserId();
  await domainActions.removeUserFromTaskAction(selectedRowIds, userId);
  revalidatePath("/events");
  revalidatePath("/dashboard");
}

export async function removeParticipant(participantId: string) {
  const userId = await getAuthenticatedUserId();
  await domainActions.removeParticipant(participantId, userId);
  revalidatePath("/profile");
  revalidatePath("/meine-aufgaben");
  revalidatePath("/events");
}
