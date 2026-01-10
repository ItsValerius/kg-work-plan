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
      logger.warn("Invalid event data", { errors: event.error.errors });
      return ApiErrorResponse.validationError(event.error.message);
    }

    try {
      const newEvent = await createOrUpdateEvent(event.data, userId);
      return Response.json(newEvent);
    } catch (error) {
      logger.error("Failed to create/update event", error);
      if (error instanceof Error && error.message === "Unauthorized") {
        return ApiErrorResponse.unauthorized();
      }
      return ApiErrorResponse.internalError("Failed to create/update event", error);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return ApiErrorResponse.unauthorized();
    }
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest("Invalid request body");
  }
}
