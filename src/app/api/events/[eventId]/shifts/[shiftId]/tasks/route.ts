import { auth } from "@/auth";
import db from "@/db/index";
import { tasks } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest } from "next/server";
import { z } from "zod";

const taskSchema = createInsertSchema(tasks).extend({
  startTime: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
});
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  try {
    const task = taskSchema.safeParse(body);
    if (task.error) throw new Error(task.error.message);
    try {
      const newTask = await db
        .insert(tasks)
        .values({
          id: task.data.id,
          name: task.data.name,
          description: task.data.description,
          shiftId: task.data.shiftId,
          startTime: task.data.startTime,
          requiredParticipants: task.data.requiredParticipants,
          createdById: session.user.id,
        })
        .onConflictDoUpdate({
          target: tasks.id,
          set: {
            name: task.data.name,
            description: task.data.description,
            startTime: task.data.startTime,
            requiredParticipants: task.data.requiredParticipants,
          },
        })
        .returning();

      return Response.json(newTask[0]);
    } catch (error) {
      if (error instanceof Error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 422 });
    }
  }
}
