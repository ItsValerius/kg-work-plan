import { auth } from "@/auth";
import db from "@/db/index";
import { tasks } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !(await isAdmin())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const formSchema = createInsertSchema(tasks).extend({
      startTime: z.preprocess(
        (arg) => (typeof arg === "string" ? new Date(arg) : arg),
        z.date()
      ),
    });

    const safe = formSchema.parse(body);

    const newTask = await db
      .insert(tasks)
      .values({
        id: safe.id,
        name: safe.name,
        description: safe.description,
        shiftId: safe.shiftId,
        startTime: safe.startTime,
        requiredParticipants: safe.requiredParticipants,
        createdById: session.user.id,
      })
      .onConflictDoUpdate({
        target: tasks.id,
        set: {
          name: safe.name,
          description: safe.description,
          startTime: safe.startTime,
          requiredParticipants: safe.requiredParticipants,
        },
      })
      .returning();

    return Response.json(newTask[0]);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
