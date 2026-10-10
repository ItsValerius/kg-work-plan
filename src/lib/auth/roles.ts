/**
 * User roles in the application
 * Centralized to avoid string literal checks throughout the codebase
 */
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user", // or null for regular users
} as const;

/**
 * Check if a role value is an admin role
 */
export function isAdminRole(role: string | null | undefined): role is typeof USER_ROLES.ADMIN {
  return role === USER_ROLES.ADMIN;
}
