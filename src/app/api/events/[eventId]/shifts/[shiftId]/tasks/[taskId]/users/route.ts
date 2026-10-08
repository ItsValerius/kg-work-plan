import { revalidateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import { ApiErrorResponse } from "@/lib/api-errors";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { participantSchema } from "@/domains/participants/types";
import { createParticipant } from "@/domains/participants/functions";
import { getAuthenticatedUserId } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();

    const body = await request.json();
    const taskParticipant = participantSchema.safeParse(body);

    if (!taskParticipant.success) {
      logger.warn("Invalid task participant data", { issues: taskParticipant.error.issues });
      return ApiErrorResponse.validationError(
        "Bitte prüfe deine Eingaben.",
        taskParticipant.error.issues,
      );
    }

    try {
      const newTaskParticipant = await createParticipant(taskParticipant.data, userId);
      // Route handlers cannot use updateTag; expire: 0 makes the next read fresh.
      revalidateTag(WORKPLAN_TAG, { expire: 0 });
      return Response.json(newTaskParticipant);
    } catch (error) {
      logger.error("Failed to create task participant", error);
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          return ApiErrorResponse.unauthorized();
        }
        if (error.message.includes("Aufgabe existiert nicht")) {
          return ApiErrorResponse.notFound(error.message);
        }
        if (error.message.includes("bereits zur Aufgabe") || error.message.includes("zu groß")) {
          return ApiErrorResponse.validationError(error.message);
        }
      }
      return ApiErrorResponse.internalError(
        "Das Eintragen hat nicht geklappt. Bitte versuch es noch einmal.",
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
