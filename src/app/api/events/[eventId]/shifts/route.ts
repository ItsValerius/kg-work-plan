import { ApiErrorResponse } from "@/lib/api-errors";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { shiftSchema } from "@/domains/shifts/types";
import { createOrUpdateShift } from "@/domains/shifts/functions";
import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedAdminUserId();
    
    const body = await request.json();
    const shift = shiftSchema.safeParse(body);

    if (!shift.success) {
      logger.warn("Invalid shift data", { issues: shift.error.issues });
      return ApiErrorResponse.validationError(shift.error.message);
    }

    try {
      const newShift = await createOrUpdateShift(shift.data, userId);
      return Response.json(newShift);
    } catch (error) {
      logger.error("Failed to create/update shift", error);
      if (error instanceof Error && error.message === "Unauthorized") {
        return ApiErrorResponse.unauthorized();
      }
      return ApiErrorResponse.internalError("Failed to create/update shift", error);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return ApiErrorResponse.unauthorized();
    }
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest("Invalid request body");
  }
}
