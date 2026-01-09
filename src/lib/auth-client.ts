import { createAuthClient } from "better-auth/react";
import { magicLinkClient, customSessionClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    magicLinkClient(),
    // Enable type inference for custom session fields
    // See: https://www.better-auth.com/docs/concepts/session-management#customizing-session-response
    customSessionClient<typeof auth>(),
  ],
});

