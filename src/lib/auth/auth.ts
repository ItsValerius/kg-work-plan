import { betterAuth } from "better-auth";
import { magicLink, customSession } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as dotenv from "dotenv";
import db from "@/db/index";
import {
  accounts,
  sessions,
  users,
  verification,
} from "../../db/schema/index";
import { eq } from "drizzle-orm";

dotenv.config();

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

        const host = new URL(url).host;
        const result = await transport.sendMail({
          to: email,
          from: process.env.EMAIL_FROM,
          subject: `Anmeldung bei ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: html({ url, host }),
        });

        const failed = result.rejected;
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
    // Customize session response to explicitly include role field
    // See: https://www.better-auth.com/docs/concepts/session-management#customizing-session-response
    customSession(async ({ user, session }) => {
      // Better Auth's Drizzle adapter may not automatically select all custom fields
      // So we explicitly fetch the role field from the database to ensure it's included
      const userWithRole = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });

      const role = userWithRole?.role ?? null;

      return {
        user: {
          ...user,
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
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])
  ],
});

function html(params: { url: string; host: string }) {
  const { url, host } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Bei <strong>${escapedHost}</strong> anmelden
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Anmelden</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
       Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.
      </td>
    </tr>
  </table>
</body>
`;
}
