import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import db from "@/db/index";
import { tasks } from "@/db/schema";
import { ApiErrorResponse } from "@/lib/api-errors";
import { isAdmin } from "@/lib/auth/utils";
import { logger } from "@/lib/logger";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest } from "next/server";
import { z } from "zod";

const taskSchema = createInsertSchema(tasks).extend({
  startTime: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
});
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id || !(await isAdmin())) {
    return ApiErrorResponse.unauthorized();
  }

  try {
    const body = await request.json();
    const task = taskSchema.safeParse(body);
    
    if (!task.success) {
      logger.warn("Invalid task data", { errors: task.error.errors });
      return ApiErrorResponse.validationError(task.error.message);
    }

    try {
      const newTask = await db
        .insert(tasks)
        .values({
          id: task.data.id,
          name: task.data.name,
          description: task.data.description,
          shiftId: task.data.shiftId,
          startTime: task.data.startTime,
          requiredParticipants: task.data.requiredParticipants,
          createdById: session.user.id,
        })
        .onConflictDoUpdate({
          target: tasks.id,
          set: {
            name: task.data.name,
            description: task.data.description,
            startTime: task.data.startTime,
            requiredParticipants: task.data.requiredParticipants,
          },
        })
        .returning();

      logger.info("Task created/updated", { taskId: newTask[0].id, shiftId: task.data.shiftId });
      return Response.json(newTask[0]);
    } catch (error) {
      logger.error("Failed to create/update task", error, { shiftId: task.data.shiftId });
      return ApiErrorResponse.internalError("Failed to create/update task", error);
    }
  } catch (error) {
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest("Invalid request body");
  }
}
