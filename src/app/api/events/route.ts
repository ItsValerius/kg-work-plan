import { revalidateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import { ApiErrorResponse } from "@/lib/api-errors";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { eventSchema } from "@/domains/events/types";
import { createOrUpdateEvent } from "@/domains/events/functions";
import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedAdminUserId();

    const body = await request.json();
    const event = eventSchema.safeParse(body);

    if (!event.success) {
      logger.warn("Invalid event data", { issues: event.error.issues });
      return ApiErrorResponse.validationError("Bitte prüfe deine Eingaben.", event.error.issues);
    }

    try {
      const newEvent = await createOrUpdateEvent(event.data, userId);
      // Route handlers cannot use updateTag; expire: 0 makes the next read fresh.
      revalidateTag(WORKPLAN_TAG, { expire: 0 });
      return Response.json(newEvent);
    } catch (error) {
      logger.error(
        "Die Veranstaltung konnte nicht gespeichert werden. Bitte versuch es noch einmal.",
        error,
      );
      if (error instanceof Error && error.message === "Unauthorized") {
        return ApiErrorResponse.unauthorized();
      }
      return ApiErrorResponse.internalError(
        "Die Veranstaltung konnte nicht gespeichert werden. Bitte versuch es noch einmal.",
        error,
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return ApiErrorResponse.unauthorized();
    }
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest();
  }
}
