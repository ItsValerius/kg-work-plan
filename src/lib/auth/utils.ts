import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { User } from "@/domains/users/types";
import { USER_ROLES, isAdminRole } from "./roles";

/**
 * Get the current user session
 */
export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
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
 * Check if the current user is logged in
 * When a session is provided (including null), returns synchronously. Otherwise, fetches the session asynchronously.
 */
export function isLoggedIn(session: SessionType | null): boolean;
export function isLoggedIn(): Promise<boolean>;
export function isLoggedIn(session?: SessionType | null): boolean | Promise<boolean> {
  if (session !== undefined) {
    // Synchronous when session is provided
    return !!session?.user;
  }
  // Asynchronous when session needs to be fetched
  return (async () => {
    const sessionToCheck = await getSession();
    return !!sessionToCheck?.user;
  })();
}

/**
 * Get the authenticated user, throws if not authenticated
 * Use this in page components to get the user object
 */
export async function getAuthenticatedUser(): Promise<User> {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  return session.user;
}