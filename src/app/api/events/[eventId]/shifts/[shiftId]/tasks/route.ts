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
      return ApiErrorResponse.validationError(task.error.message);
    }

    try {
      const newTask = await createOrUpdateTask(task.data, userId);
      return Response.json(newTask);
    } catch (error) {
      logger.error("Failed to create/update task", error);
      if (error instanceof Error && error.message === "Unauthorized") {
        return ApiErrorResponse.unauthorized();
      }
      return ApiErrorResponse.internalError("Failed to create/update task", error);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return ApiErrorResponse.unauthorized();
    }
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest("Invalid request body");
  }
}
