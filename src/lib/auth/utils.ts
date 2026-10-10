import { auth } from "@/lib/auth/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { connection } from "next/server";
import type { User } from "@/domains/users/types";
import { isAdminRole } from "./roles";

/**
 * Get the current user session. Deduplicated per request, so layouts, pages and
 * helpers can all ask without extra database round trips.
 */
export const getSession = cache(async () => {
  // Better Auth checks expiry against the clock, so the lookup must wait for a real
  // request instead of running in a per-visitor prerender.
  await connection();
  return auth.api.getSession({
    headers: await headers(),
  });
});

/**
 * The session straight from the database, skipping the cookie cache. Server actions and
 * API routes authorize with this, so a revoked session or removed role stops them at once.
 */
async function getFreshSession() {
  return auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
}

/**
 * Better Auth answers "no session" when its database is unreachable. A session cookie
 * without a session means the state is unknown rather than signed out.
 */
export async function hasSessionCookie(): Promise<boolean> {
  return (await cookies())
    .getAll()
    .some((cookie) => cookie.name.endsWith("better-auth.session_token"));
}

/**
 * Get the authenticated user ID, throws if not authenticated
 * Use this in server actions to ensure user is logged in
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const session = await getFreshSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * Get the authenticated user ID only if they are an admin, throws otherwise
 * Use this in server actions that require admin privileges
 */
export async function getAuthenticatedAdminUserId(): Promise<string> {
  const session = await getFreshSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  if (!isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/** Whether the current visitor is an admin (cached session, for rendering). */
export async function isAdmin(): Promise<boolean> {
  return isAdminRole((await getSession())?.user?.role);
}

/**
 * Get the authenticated user for a page; sends signed-out visitors to the sign-in page.
 */
export async function getAuthenticatedUser(callbackUrl?: string): Promise<User> {
  const session = await getSession();
  if (!session?.user) {
    redirect(
      callbackUrl ? `/anmelden?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/anmelden",
    );
  }

  // Better Auth leaves unset optional fields undefined; the app's User type uses null.
  const { user } = session;
  return { ...user, image: user.image ?? null, role: user.role ?? null };
}

/**
 * The admin's user id for an organizer page. Signed-out visitors go to sign-in and
 * helpers back to the start page, instead of hitting an error page.
 */
export async function requireAdminUserId(callbackUrl?: string): Promise<string> {
  const user = await getAuthenticatedUser(callbackUrl);
  if (!isAdminRole(user.role)) {
    redirect("/");
  }
  return user.id;
}
