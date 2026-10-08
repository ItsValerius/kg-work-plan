"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/tasks/functions";
import type { TaskInput } from "@/domains/tasks/types";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

export async function createOrUpdateTask(data: TaskInput) {
  const userId = await getAuthenticatedAdminUserId();
  const result = await domainActions.createOrUpdateTask(data, userId);
  updateTag(WORKPLAN_TAG);
  return result;
}

export type QuickAddTaskResult = { ok: true } | { ok: false; error: string };

/**
 * Adds a task straight from the event's work plan. Validation problems come back as
 * data, because production builds hide thrown server-action messages.
 */
export async function quickAddTask(input: {
  shiftId: string;
  name: string;
  startTime: Date;
  requiredParticipants: number;
}): Promise<QuickAddTaskResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedAdminUserId();
  } catch {
    return { ok: false, error: "Nur Organisatoren können Aufgaben anlegen." };
  }

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Bitte gib der Aufgabe einen Namen." };
  if (!Number.isInteger(input.requiredParticipants) || input.requiredParticipants < 1) {
    return { ok: false, error: "Es muss mindestens eine Person gebraucht werden." };
  }
  if (Number.isNaN(new Date(input.startTime).getTime())) {
    return { ok: false, error: "Bitte gib eine gültige Uhrzeit an." };
  }

  try {
    await domainActions.createOrUpdateTask(
      {
        name,
        description: "",
        shiftId: input.shiftId,
        startTime: new Date(input.startTime),
        requiredParticipants: input.requiredParticipants,
        createdById: userId,
      },
      userId
    );
  } catch {
    return { ok: false, error: "Die Aufgabe konnte nicht gespeichert werden. Bitte versuche es noch einmal." };
  }

  updateTag(WORKPLAN_TAG);
  return { ok: true };
}
