import { ApiErrorResponse } from "@/lib/api-errors";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { updateUserProfile } from "@/domains/users/functions";
import { getAuthenticatedUserId } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
    const authenticatedUserId = await getAuthenticatedUserId();

    const body = await request.json();
    if (authenticatedUserId !== body.id) {
      return ApiErrorResponse.unauthorized("You can only update your own profile");
    }

    const updatedUser = await updateUserProfile(body.id, body.name, authenticatedUserId);

    return Response.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return ApiErrorResponse.unauthorized();
    }
    logger.error("Failed to update user profile", error);
    return ApiErrorResponse.internalError("Failed to update profile", error);
  }
}
