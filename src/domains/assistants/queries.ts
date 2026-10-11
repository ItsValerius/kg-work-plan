import db from "@/db";
import { oauthClient, oauthConsent, users } from "@/db/schema";
import { isAdminRole } from "@/lib/auth/roles";
import { and, desc, eq } from "drizzle-orm";

/** The AI assistants this user has allowed to use /api/mcp, newest first. */
export async function getAssistantConnections(userId: string) {
  return db
    .select({
      clientId: oauthConsent.clientId,
      name: oauthClient.name,
      uri: oauthClient.uri,
      connectedAt: oauthConsent.createdAt,
    })
    .from(oauthConsent)
    .innerJoin(oauthClient, eq(oauthClient.clientId, oauthConsent.clientId))
    .where(eq(oauthConsent.userId, userId))
    .orderBy(desc(oauthConsent.createdAt));
}

/**
 * Whether a token for this user and assistant may still call /api/mcp: the user is an admin
 * and hasn't disconnected the assistant. Read uncached on every call, because the access
 * tokens themselves stay valid for an hour.
 */
export async function getMcpAccess(userId: string, clientId: string) {
  const [row] = await db
    .select({ role: users.role, consentId: oauthConsent.id })
    .from(users)
    .leftJoin(
      oauthConsent,
      and(eq(oauthConsent.userId, users.id), eq(oauthConsent.clientId, clientId)),
    )
    .where(eq(users.id, userId))
    .limit(1);
  return { isAdmin: isAdminRole(row?.role), connected: !!row?.consentId };
}
