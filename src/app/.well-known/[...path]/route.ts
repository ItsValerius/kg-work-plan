import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// MCP clients look for OAuth discovery at the site root (e.g.
// /.well-known/oauth-protected-resource/api/mcp); Better Auth answers these too.
export const { GET } = toNextJsHandler(auth);
