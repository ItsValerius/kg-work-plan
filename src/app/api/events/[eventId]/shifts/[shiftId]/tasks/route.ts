import { auth } from "@/auth";
import db from "@/db/index";
import { tasks } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isAdmin(session.user)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const newTask = await db
      .insert(tasks)
      .values({
        id: body.id,
        name: body.name,
        description: body.description,
        shiftId: body.shiftId,
        requiredParticipants: body.requiredParticipants,
        createdById: session.user.id,
      })
      .onConflictDoUpdate({
        target: tasks.id,
        set: {
          name: body.name,
          description: body.description,
          requiredParticipants: body.requiredParticipants,
        },
      })
      .returning();

    return Response.json(newTask[0]);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
