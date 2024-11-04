import { auth } from "@/auth";
import { events, shifts } from "@/db/schema";
import db from "@/db/index";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const event = await db.query.events.findFirst({
      where: eq(events.id, body.eventId),
    });

    if (!event) return notFound();

    const shiftStartTime = event.startDate;
    shiftStartTime.setHours(
      new Date(body.startTime).getHours(),
      new Date(body.startTime).getMinutes(),
      0,
      0
    );

    const shiftEndTime = event.endDate;
    shiftEndTime.setHours(
      new Date(body.endTime).getHours(),
      new Date(body.endTime).getMinutes(),
      0,
      0
    );

    const newShift = await db
      .insert(shifts)
      .values({
        name: body.name,
        startTime: shiftStartTime,
        endTime: shiftEndTime,
        eventId: body.eventId,
        createdById: session.user.id,
      })
      .returning();

    return Response.json(newShift[0]);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
