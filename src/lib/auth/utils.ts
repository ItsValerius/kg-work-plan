import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

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
  const userIsAdmin = session.user.role === "admin";
  if (!userIsAdmin) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * Check if the current user is an admin
 */
export const isAdmin = async () => {
  const session = await getSession();
  return session?.user?.role === "admin";
};

/**
 * Check if the current user is logged in
 */
export const isLoggedIn = async () => {
  const session = await getSession();
  return !!session?.user;
};

/**
 * Get the authenticated user, throws if not authenticated
 * Use this in page components to get the user object
 */
export async function getAuthenticatedUser() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("User not authenticated");
  }
  return session.user;
}
