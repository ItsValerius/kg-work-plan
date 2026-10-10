import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";

/**
 * The user's display name from the database. The session's copy can be up to the cookie
 * cache's maxAge old, which would undo a rename on the profile page.
 */
export async function getUserName(userId: string): Promise<string | null> {
  "use cache";
  cacheLife("workplan");
  cacheTag(WORKPLAN_TAG);
  const [user] = await db.select({ name: users.name }).from(users).where(eq(users.id, userId));
  return user?.name ?? null;
}
