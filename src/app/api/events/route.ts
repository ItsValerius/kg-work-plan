import { auth } from "@/auth";
import { events } from "@/db/schema";
import db from "@/db/index";
import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !(await isAdmin())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const newEvent = await db
      .insert(events)
      .values({
        id: body.id,
        name: body.name,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        createdById: session.user.id,
      })
      .onConflictDoUpdate({
        target: events.id,
        set: {
          name: body.name,
          description: body.description,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
        },
      })
      .returning();

    return Response.json(newEvent[0]);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
