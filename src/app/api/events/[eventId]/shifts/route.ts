import { revalidateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
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
      return ApiErrorResponse.validationError("Bitte prüfe deine Eingaben.", shift.error.issues);
    }

    try {
      const newShift = await createOrUpdateShift(shift.data, userId);
      // Route handlers cannot use updateTag; expire: 0 makes the next read fresh.
      revalidateTag(WORKPLAN_TAG, { expire: 0 });
      return Response.json(newShift);
    } catch (error) {
      logger.error("Die Schicht konnte nicht gespeichert werden. Bitte versuch es noch einmal.", error);
      if (error instanceof Error && error.message === "Unauthorized") {
        return ApiErrorResponse.unauthorized();
      }
      return ApiErrorResponse.internalError("Die Schicht konnte nicht gespeichert werden. Bitte versuch es noch einmal.", error);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return ApiErrorResponse.unauthorized();
    }
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest();
  }
}
