"use server";

import type { ActionResult } from "@/lib/validation";
import { disconnectAssistant as disconnect } from "@/domains/assistants/functions";
import { clientIdSchema } from "@/domains/assistants/types";
import { getAuthenticatedUserId } from "@/lib/auth/utils";

/** Disconnects one of the signed-in user's AI assistants. */
export async function disconnectAssistant(clientId: string): Promise<ActionResult> {
  let userId: string;
  try {
    userId = await getAuthenticatedUserId();
  } catch {
    return { ok: false, error: "Bitte melde dich zuerst an." };
  }
  const parsed = clientIdSchema.safeParse(clientId);
  if (!parsed.success) {
    return { ok: false, error: "Diese Verbindung gibt es nicht." };
  }

  try {
    await disconnect(userId, parsed.data);
  } catch {
    return { ok: false, error: "Das Trennen hat nicht geklappt. Bitte versuche es noch einmal." };
  }
  return { ok: true };
}
