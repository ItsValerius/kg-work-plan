import { auth } from "@/auth";
import db from "@/db/index";
import { taskParticipants } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

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

    return Response.json(newTaskParticipant[0]);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
