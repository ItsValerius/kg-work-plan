import { auth } from "@/auth";
import db from "@/db/index";
import { shifts } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest } from "next/server";
import z from "zod";
const shiftSchema = createInsertSchema(shifts).extend({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  try {
    const shift = shiftSchema.safeParse(body);

    if (!shift.success) throw new Error(shift.error.message);
    try {
      const newShift = await db
        .insert(shifts)
        .values({
          id: shift.data.id,
          name: shift.data.name,
          startTime: new Date(shift.data.startTime),
          endTime: new Date(shift.data.endTime),
          eventId: shift.data.eventId,
          createdById: session.user.id,
        })
        .onConflictDoUpdate({
          target: shifts.id,
          set: {
            name: shift.data.name,
            startTime: new Date(shift.data.startTime),
            endTime: new Date(shift.data.endTime),
          },
        })
        .returning();

      return Response.json(newShift[0]);
    } catch (error) {
      console.log(error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        { error: "Invalid Input data", message: error.message },
        { status: 422 }
      );
    }
  }
}
