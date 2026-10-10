import { createAuthClient } from "better-auth/react";
import { magicLinkClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth/auth";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin // In browser: use current origin (works for any deployment URL)
      : undefined,
  plugins: [
    magicLinkClient(),
    // Types the user's role on the client.
    inferAdditionalFields<typeof auth>(),
  ],
});
