import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { magicLink } from "better-auth/plugins/magic-link";
import { jwt } from "better-auth/plugins";
import { mcp } from "@better-auth/mcp";
import { cimd } from "@better-auth/cimd";
import { fetchClientMetadataResource } from "@better-auth/cimd/node";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db/index";
import {
  accounts,
  jwks,
  oauthAccessToken,
  oauthClient,
  oauthClientAssertion,
  oauthClientResource,
  oauthConsent,
  oauthRefreshToken,
  oauthResource,
  rateLimit,
  sessions,
  users,
  verification,
} from "../../db/schema/index";
import { renderMagicLinkEmail } from "./magic-link-email";

const MAGIC_LINK_MINUTES = 15;

/** What AI assistants connect to; access tokens are bound to exactly this URL. */
export const MCP_RESOURCE = `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/api/mcp`;

// Better Auth configuration with magic link (passwordless email) authentication
// See: https://www.better-auth.com/docs/plugins/magic-link
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL provider
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verification,
      rateLimit: rateLimit,
      jwks,
      oauthClient,
      oauthResource,
      oauthClientResource,
      oauthRefreshToken,
      oauthAccessToken,
      oauthConsent,
      oauthClientAssertion,
    },
  }),
  plugins: [
    // Signs the access tokens that /api/mcp verifies.
    jwt(),
    // Lets admins connect ChatGPT, Claude & co. to /api/mcp via OAuth; tools check the role.
    mcp({
      loginPage: "/anmelden",
      consentPage: "/zugriff-erlauben",
      resource: MCP_RESOURCE,
      // No `email`: assistants request every advertised OIDC scope.
      scopes: ["openid", "profile", "offline_access"],
      // Fallback for clients without CIMD; registering alone grants nothing.
      allowDynamicClientRegistration: true,
      allowUnauthenticatedClientRegistration: true,
    }),
    cimd({ fetchClientMetadataResource, metadataProfile: "mcp-2026-07-28" }),
    magicLink({
      // Long enough for someone who checks their mail a little later; the link works once.
      expiresIn: MAGIC_LINK_MINUTES * 60,
      // Counted per IP; phones on mobile data often share one, so allow a burst of helpers.
      rateLimit: { window: 60, max: 20 },
      sendMagicLink: async ({ email, url }) => {
        const { createTransport } = await import("nodemailer");
        const transport = createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT) || 587,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        const { subject, text, html } = renderMagicLinkEmail({
          url,
          baseUrl: process.env.BETTER_AUTH_URL ?? new URL(url).origin,
          minutesValid: MAGIC_LINK_MINUTES,
        });
        const result = await transport.sendMail({
          to: email,
          from: process.env.EMAIL_FROM,
          subject,
          text,
          html,
        });

        const failed = result.rejected;
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
  hooks: {
    // CLI agents (Claude Code, Codex) register http://localhost callbacks without an
    // application_type; the "web" default rejects those, "native" allows loopback http.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/oauth2/register" || ctx.body?.application_type) return;
      const uris: unknown = ctx.body?.redirect_uris;
      if (Array.isArray(uris) && uris.some((uri) => String(uri).startsWith("http://"))) {
        return { context: { body: { ...ctx.body, application_type: "native" } } };
      }
    }),
  },
  user: {
    // Returned with every session; input: false keeps sign-up from setting it.
    additionalFields: {
      role: { type: "string", required: false, input: false },
    },
  },
  // Shared counters, so the magic-link limit holds across server instances.
  rateLimit: {
    storage: "database",
    // Client registration needs no sign-in and adds a row each time.
    customRules: { "/oauth2/register": { window: 60, max: 5 } },
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    // Pages read the session from this signed cookie instead of the database; src/proxy.ts
    // keeps it fresh. Writes skip it (see getFreshSession), so revocations and role changes
    // apply to them at once and to pages within maxAge.
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});
