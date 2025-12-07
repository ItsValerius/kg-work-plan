import { auth } from "@/auth";
import db from "@/db/index";
import { taskParticipants, tasks } from "@/db/schema";
import { ApiErrorResponse } from "@/lib/api-errors";
import { logger } from "@/lib/logger";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

const taskParticipantsSchema = createInsertSchema(taskParticipants).extend({
  groupName: z.string().optional(),
  groupSize: z.number().optional(),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return ApiErrorResponse.unauthorized();
  }

  try {
    const body = await request.json();
    const taskParticipant = taskParticipantsSchema.safeParse(body);
    
    if (!taskParticipant.success) {
      logger.warn("Invalid task participant data", { errors: taskParticipant.error.errors });
      return ApiErrorResponse.validationError(taskParticipant.error.message);
    }

    try {
      // Check if user is already registered
      if (
        await db.query.taskParticipants.findFirst({
          where: and(
            eq(taskParticipants.userId, session.user.id),
            eq(taskParticipants.taskId, taskParticipant.data.taskId)
          ),
        })
      ) {
        return ApiErrorResponse.validationError("Benutzer bereits zur Aufgabe eingetragen.");
      }

      // Get task with participants
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskParticipant.data.taskId),
        with: { participants: true },
      });
      
      if (!task) {
        return ApiErrorResponse.notFound("Aufgabe existiert nicht.");
      }

      // Check capacity
      const currentParticipantsCount = task.participants.reduce(
        (accumulator, participant) => accumulator + participant.groupSize,
        0
      );

      const requestedGroupSize = taskParticipant.data.groupSize ?? 1;
      if (
        requestedGroupSize > task.requiredParticipants ||
        requestedGroupSize + currentParticipantsCount > task.requiredParticipants
      ) {
        return ApiErrorResponse.validationError(
          "Die Mitgliederanzahl der Gruppe ist zu groß für diese Aufgabe."
        );
      }

      // Create participant
      const newTaskParticipant = await db
        .insert(taskParticipants)
        .values({
          groupName: taskParticipant.data.groupName,
          groupSize: taskParticipant.data.groupSize,
          userId: session.user.id,
          taskId: taskParticipant.data.taskId,
          createdById: session.user.id,
        })
        .returning();
      
      logger.info("Task participant created", {
        taskId: taskParticipant.data.taskId,
        userId: session.user.id,
      });
      revalidatePath("/events");
      return Response.json(newTaskParticipant[0]);
    } catch (error) {
      logger.error("Failed to create task participant", error, {
        taskId: taskParticipant.data.taskId,
        userId: session.user.id,
      });
      return ApiErrorResponse.internalError("Failed to register for task", error);
    }
  } catch (error) {
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest("Invalid request body");
  }
}
