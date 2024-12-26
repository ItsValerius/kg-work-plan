import { auth } from "@/auth";
import db from "@/db/index";
import { shifts } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !(await isAdmin())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log(body);

    const newShift = await db
      .insert(shifts)
      .values({
        id: body.id,
        name: body.name,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        eventId: body.eventId,
        createdById: session.user.id,
      })
      .onConflictDoUpdate({
        target: shifts.id,
        set: {
          name: body.name,
          startTime: new Date(body.startTime),
          endTime: new Date(body.endTime),
        },
      })
      .returning();

    return Response.json(newShift[0]);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
