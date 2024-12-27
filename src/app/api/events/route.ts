import { auth } from "@/auth";
import db from "@/db/index";
import { events } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

const eventSchema = createInsertSchema(events).extend({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const event = eventSchema.safeParse(body);

    if (!event.success) throw new Error(event.error.message);
    try {
      const newEvent = await db
        .insert(events)
        .values({
          id: event.data.id,
          name: event.data.name,
          description: event.data.description,
          startDate: new Date(event.data.startDate),
          endDate: new Date(event.data.endDate),
          createdById: session.user.id,
        })
        .onConflictDoUpdate({
          target: events.id,
          set: {
            name: event.data.name,
            description: event.data.description,
            startDate: new Date(event.data.startDate),
            endDate: new Date(event.data.endDate),
          },
        })
        .returning();
      revalidatePath("/events");
      return Response.json(newEvent[0]);
    } catch (error) {
      console.log(error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return Response.json(
        { error: "Invalid Input data", message: error.message },
        { status: 422 }
      );
    }
  }
}
