import db from "@/db";
import { oauthAccessToken, oauthConsent, oauthRefreshToken } from "@/db/schema";
import { logger } from "@/lib/logger";
import { and, eq } from "drizzle-orm";

/**
 * Disconnects an AI assistant for this user: its consent and tokens go, so it must ask
 * again. The OAuth client itself stays, because clients like ChatGPT's are shared by
 * everyone who connects it.
 */
export async function disconnectAssistant(userId: string, clientId: string) {
  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(oauthAccessToken)
        .where(and(eq(oauthAccessToken.userId, userId), eq(oauthAccessToken.clientId, clientId)));
      await tx
        .delete(oauthRefreshToken)
        .where(and(eq(oauthRefreshToken.userId, userId), eq(oauthRefreshToken.clientId, clientId)));
      await tx
        .delete(oauthConsent)
        .where(and(eq(oauthConsent.userId, userId), eq(oauthConsent.clientId, clientId)));
    });
    logger.info("AI assistant disconnected", { userId, clientId });
  } catch (error) {
    logger.error("Failed to disconnect AI assistant", error, { userId, clientId });
    throw new Error("Failed to disconnect AI assistant");
  }
}
