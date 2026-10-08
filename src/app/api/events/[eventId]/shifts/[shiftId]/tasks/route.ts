import { revalidateTag } from "next/cache";
import { WORKPLAN_TAG } from "@/lib/cache-tags";
import { ApiErrorResponse } from "@/lib/api-errors";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { taskSchema } from "@/domains/tasks/types";
import { createOrUpdateTask } from "@/domains/tasks/functions";
import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedAdminUserId();
    
    const body = await request.json();
    const task = taskSchema.safeParse(body);
    
    if (!task.success) {
      logger.warn("Invalid task data", { issues: task.error.issues });
      return ApiErrorResponse.validationError("Bitte prüfe deine Eingaben.", task.error.issues);
    }

    try {
      const newTask = await createOrUpdateTask(task.data, userId);
      // Route handlers cannot use updateTag; expire: 0 makes the next read fresh.
      revalidateTag(WORKPLAN_TAG, { expire: 0 });
      return Response.json(newTask);
    } catch (error) {
      logger.error("Die Aufgabe konnte nicht gespeichert werden. Bitte versuch es noch einmal.", error);
      if (error instanceof Error && error.message === "Unauthorized") {
        return ApiErrorResponse.unauthorized();
      }
      return ApiErrorResponse.internalError("Die Aufgabe konnte nicht gespeichert werden. Bitte versuch es noch einmal.", error);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return ApiErrorResponse.unauthorized();
    }
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest();
  }
}
