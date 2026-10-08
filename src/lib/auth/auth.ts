import { betterAuth } from "better-auth";
import { magicLink, customSession } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as dotenv from "dotenv";
import db from "@/db/index";
import { accounts, sessions, users, verification } from "../../db/schema/index";
import { eq } from "drizzle-orm";
import { renderMagicLinkEmail } from "./magic-link-email";

const MAGIC_LINK_MINUTES = 15;

dotenv.config({ quiet: true });

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
    },
  }),
  plugins: [
    magicLink({
      // Long enough for someone who checks their mail a little later; the link works once.
      expiresIn: MAGIC_LINK_MINUTES * 60,
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
    // Customize session response to normalize user fields (undefined → null)
    // See: https://www.better-auth.com/docs/concepts/session-management#customizing-session-response
    customSession(async ({ user, session }) => {
      // Better Auth's Drizzle adapter may not automatically select all custom fields
      // So we explicitly fetch the role field from the database to ensure it's included
      const userWithRole = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });

      const role = userWithRole?.role ?? null;

      // Normalize undefined values to null to match Drizzle schema types
      // Drizzle schema expects string | null, but better-auth may return undefined
      return {
        user: {
          ...user,
          name: user.name ?? null,
          image: user.image ?? null,
          role,
        },
        session,
      };
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});
