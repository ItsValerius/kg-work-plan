import { auth } from "@/auth";
import { events } from "@/db/schema";
import db from "@/db/index";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newEvent = await db
      .insert(events)
      .values({
        name: body.name,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        createdById: session.user.id,
      })
      .returning();

    return Response.json(newEvent[0]);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
