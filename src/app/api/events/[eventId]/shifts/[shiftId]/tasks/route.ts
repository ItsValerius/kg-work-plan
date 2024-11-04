import { auth } from "@/auth";
import db from "@/db/index";
import { tasks } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const newTask = await db
      .insert(tasks)
      .values({
        name: body.name,
        description: body.description,
        shiftId: body.shiftId,
        requiredParticipants: body.requiredParticipants,
        createdById: session.user.id,
      })
      .returning();

    return Response.json(newTask[0]);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
