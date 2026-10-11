"use server";

import { disconnectAssistant as disconnect } from "@/domains/assistants/functions";
import { clientIdSchema } from "@/domains/assistants/types";
import { getAuthenticatedUserId } from "@/lib/auth/utils";

export type DisconnectAssistantResult = { ok: true } | { ok: false; error: string };

/**
 * Disconnects one of the signed-in user's AI assistants. Returns the reason instead of
 * throwing, because production builds hide thrown server-action messages.
 */
export async function disconnectAssistant(clientId: string): Promise<DisconnectAssistantResult> {
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
