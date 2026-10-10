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
  const session = await getSession();
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
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  if (!isAdminRole(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

type SessionType = Awaited<ReturnType<typeof getSession>>;

/**
 * Check if the current user is an admin
 * When a session is provided (including null), returns synchronously. Otherwise, fetches the session asynchronously.
 */
export function isAdmin(session: SessionType | null): boolean;
export function isAdmin(): Promise<boolean>;
export function isAdmin(session?: SessionType | null): boolean | Promise<boolean> {
  // Check if an argument was provided (distinguishes undefined from null/explicitly passed)
  // This ensures that when session is explicitly passed (including null), we return synchronously
  if (session !== undefined) {
    // Synchronous when session is provided (handles null gracefully)
    return isAdminRole(session?.user?.role);
  }
  // Asynchronous when no argument provided - fetch session
  return (async () => {
    const sessionToCheck = await getSession();
    return isAdminRole(sessionToCheck?.user?.role);
  })();
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
