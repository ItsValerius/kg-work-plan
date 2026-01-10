import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import db from "@/db/index";
import { users } from "@/db/schema";
import { ApiErrorResponse } from "@/lib/api-errors";
import { logger } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return ApiErrorResponse.unauthorized();
    }

    const body = await request.json();
    if (session.user.id !== body.id) {
      return ApiErrorResponse.unauthorized("You can only update your own profile");
    }

    const updatedUser = await db
      .update(users)
      .set({
        name: body.name,
      })
      .where(eq(users.id, body.id))
      .returning();

    logger.info("User profile updated", { userId: body.id });
    return Response.json(updatedUser[0]);
  } catch (error) {
    logger.error("Failed to update user profile", error);
    return ApiErrorResponse.internalError("Failed to update profile", error);
  }
}
