"use server";

import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import * as domainActions from "@/domains/tasks/functions";
import { quickAddTaskSchema, taskSchema, type TaskInput } from "@/domains/tasks/types";
import { firstIssueMessage } from "@/lib/validation";
import { updateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import type { SaveResult } from "./events";

export type QuickAddTaskResult = { ok: true } | { ok: false; error: string };

/**
 * Adds a task straight from the event's work plan. Validation problems come back as
 * data, because production builds hide thrown server-action messages.
 */
export async function quickAddTask(raw: {
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

  const parsed = quickAddTaskSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }
  const input = parsed.data;

  try {
    await domainActions.createOrUpdateTask(
      {
        name: input.name,
        description: "",
        shiftId: input.shiftId,
        startTime: input.startTime,
        requiredParticipants: input.requiredParticipants,
        createdById: userId,
      },
      userId,
    );
  } catch {
    return {
      ok: false,
      error: "Die Aufgabe konnte nicht gespeichert werden. Bitte versuche es noch einmal.",
    };
  }

  updateTag(WORKPLAN_TAG);
  return { ok: true };
}

/**
 * Saves the task form (create or edit). Returns the reason instead of throwing, because
 * production builds hide thrown server-action messages from the browser.
 */
export async function saveTask(raw: TaskInput): Promise<SaveResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedAdminUserId();
  } catch {
    return { ok: false, error: "Nur Organisatoren können Aufgaben speichern." };
  }
  const parsed = taskSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: firstIssueMessage(parsed.error) };
  }

  let id: string;
  try {
    id = (await domainActions.createOrUpdateTask(parsed.data, userId)).id;
  } catch {
    return {
      ok: false,
      error: "Die Aufgabe konnte nicht gespeichert werden. Bitte versuch es noch einmal.",
    };
  }
  updateTag(WORKPLAN_TAG);
  return { ok: true, id };
}
