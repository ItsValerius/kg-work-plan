import { requireMcpAuth } from "@better-auth/mcp";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { getMcpAccess } from "@/domains/assistants/queries";
import { auth, MCP_RESOURCE } from "@/lib/auth/auth";
import { buildMcpServer } from "@/server/mcp/tools";

const { origin, pathname } = new URL(MCP_RESOURCE);
const RESOURCE_METADATA = `${origin}/.well-known/oauth-protected-resource${pathname}`;

// Stateless: a fresh server per request. 2025-era clients (ChatGPT targets the 2025-11-25
// spec) go through the SDK's legacy fallback, so `legacy` stays at its default.
const mcp = createMcpHandler(({ authInfo }) => buildMcpServer(String(authInfo?.extra?.userId)));

/**
 * The MCP endpoint for admins' AI assistants. `requireMcpAuth` checks the OAuth access
 * token (signature, issuer, audience = MCP_RESOURCE, expiry) and answers 401 with the
 * discovery challenge; whether the user is still an admin and still connected to this
 * assistant is read fresh on every call.
 */
const handler = requireMcpAuth(
  auth,
  async (request, claims) => {
    const userId = claims.sub;
    const clientId = typeof claims.azp === "string" ? claims.azp : "";
    const access = userId ? await getMcpAccess(userId, clientId) : null;
    if (!access?.connected) {
      // Disconnected under /organisation/ki-assistenten: the assistant has to ask again.
      return Response.json(
        { error: "invalid_token", error_description: "Die Verbindung wurde getrennt." },
        {
          status: 401,
          headers: {
            "WWW-Authenticate": `Bearer error="invalid_token", resource_metadata="${RESOURCE_METADATA}"`,
          },
        },
      );
    }
    if (!access.isAdmin) {
      // A plain 403: granting scopes can't fix a missing admin role.
      return Response.json(
        {
          error: "forbidden",
          error_description: "Nur Organisatoren können den Arbeitsplan verbinden.",
        },
        { status: 403 },
      );
    }
    return mcp.fetch(request, {
      authInfo: {
        token: "",
        clientId,
        scopes: typeof claims.scope === "string" ? claims.scope.split(" ") : [],
        extra: { userId },
      },
    });
  },
  { resource: MCP_RESOURCE },
);

export { handler as GET, handler as POST, handler as DELETE };
