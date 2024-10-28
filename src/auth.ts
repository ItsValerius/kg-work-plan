import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/index";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import * as dotenv from "dotenv";
import { type DefaultSession } from "next-auth";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "./db/schema/index";
import { randomBytes, randomUUID } from "crypto";

dotenv.config();

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // GoogleProvider({
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.picture,
    //       role: "user",
    //     };
    //   },
    //   clientId: process.env.AUTH_GOOGLE_ID as string,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    // }),
    // AppleProvider({
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: null,
    //       role: "user",
    //     };
    //   },
    //   clientId: process.env.AUTH_APPLE_ID as string,
    //   clientSecret: process.env.AUTH_APPLE_SECRET as string,
    // }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role;
      }
      return session;
    },
  },
});
