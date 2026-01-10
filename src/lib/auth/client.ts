import { createAuthClient } from "better-auth/react";
import { magicLinkClient, customSessionClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth/auth";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" 
    ? window.location.origin  // In browser: use current origin (works for any deployment URL)
    : undefined,
  plugins: [
    magicLinkClient(),
    // Enable type inference for custom session fields
    // See: https://www.better-auth.com/docs/concepts/session-management#customizing-session-response
    customSessionClient<typeof auth>(),
  ],
});
