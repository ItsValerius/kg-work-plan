import { auth } from "@/auth";
import db from "@/db/index";
import { taskParticipants, tasks } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (
      await db.query.taskParticipants.findFirst({
        where: and(
          eq(taskParticipants.userId, session.user.id),
          eq(taskParticipants.taskId, body.taskId)
        ),
      })
    ) {
      return Response.json(
        { error: "Benutzer bereits zur Aufgabe eingetragen." },
        { status: 422 }
      );
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, body.taskId),
    });

    if (task && body.groupSize > task?.requiredParticipants) {
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
        groupName: body.groupName,
        groupSize: body.groupSize,
        userId: session.user.id,
        taskId: body.taskId,
        createdById: session.user.id,
      })
      .returning();
    revalidatePath("/events");
    return Response.json(newTaskParticipant[0]);
  } catch (error) {
    console.log(error);

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
