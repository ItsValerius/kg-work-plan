import { auth } from "@/auth";
import db from "@/db/index";
import { taskParticipants, tasks } from "@/db/schema";
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
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  try {
    const taskParticipant = taskParticipantsSchema.safeParse(body);
    if (taskParticipant.error) throw new Error(taskParticipant.error.message);
    try {
      if (
        await db.query.taskParticipants.findFirst({
          where: and(
            eq(taskParticipants.userId, session.user.id),
            eq(taskParticipants.taskId, taskParticipant.data.taskId)
          ),
        })
      ) {
        return Response.json(
          { error: "Benutzer bereits zur Aufgabe eingetragen." },
          { status: 422 }
        );
      }

      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskParticipant.data.taskId),
        with: { participants: true },
      });
      if (!task) {
        return Response.json(
          { error: "Aufgabe existiert nicht." },
          { status: 404 }
        );
      }

      const currentParticipantsCount = task.participants.reduce(
        (accumulator, participant) => accumulator + participant.groupSize,
        0
      );

      if (
        (taskParticipant.data.groupSize ?? 1) > task.requiredParticipants ||
        (taskParticipant.data.groupSize ?? 1) + currentParticipantsCount >
          task.requiredParticipants
      ) {
        return Response.json(
          {
            error:
              "Die Mitgliederanzahl der Gruppe ist zu groß für diese Aufgabe.",
          },
          { status: 422 }
        );
      }

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
      revalidatePath("/events");
      return Response.json(newTaskParticipant[0]);
    } catch (error) {
      if (error instanceof Error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 422 });
    }
  }
}
