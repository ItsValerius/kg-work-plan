import { createAuthClient } from "better-auth/react";
import { magicLinkClient, inferAdditionalFields } from "better-auth/client/plugins";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import type { auth } from "@/lib/auth/auth";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin // In browser: use current origin (works for any deployment URL)
      : undefined,
  plugins: [
    magicLinkClient(),
    // Sends the signed OAuth query along from the sign-in and consent pages.
    oauthProviderClient(),
    // Types the user's role on the client.
    inferAdditionalFields<typeof auth>(),
  ],
});
