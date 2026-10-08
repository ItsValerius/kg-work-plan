import { revalidateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
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
      return ApiErrorResponse.unauthorized("Du kannst nur dein eigenes Profil ändern.");
    }

    const updatedUser = await updateUserProfile(body.id, body.name, authenticatedUserId);

    // Route handlers cannot use updateTag; expire: 0 makes the next read fresh.
    revalidateTag(WORKPLAN_TAG, { expire: 0 });
    return Response.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return ApiErrorResponse.unauthorized();
    }
    logger.error("Failed to update user profile", error);
    return ApiErrorResponse.internalError(
      "Dein Profil konnte nicht gespeichert werden. Bitte versuch es noch einmal.",
      error,
    );
  }
}
