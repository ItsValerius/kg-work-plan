/**
 * User roles in the application
 * Centralized to avoid string literal checks throughout the codebase
 */
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user", // or null for regular users
} as const;

/**
 * Type for valid user roles
 */
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES] | null;

/**
 * Check if a role value is an admin role
 */
export function isAdminRole(role: string | null | undefined): role is typeof USER_ROLES.ADMIN {
  return role === USER_ROLES.ADMIN;
}
