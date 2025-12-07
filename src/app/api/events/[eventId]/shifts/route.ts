import { auth } from "@/auth";
import db from "@/db/index";
import { shifts } from "@/db/schema";
import { ApiErrorResponse } from "@/lib/api-errors";
import { isAdmin } from "@/lib/auth/utils";
import { logger } from "@/lib/logger";
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
    return ApiErrorResponse.unauthorized();
  }

  try {
    const body = await request.json();
    const shift = shiftSchema.safeParse(body);

    if (!shift.success) {
      logger.warn("Invalid shift data", { errors: shift.error.errors });
      return ApiErrorResponse.validationError(shift.error.message);
    }

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

      logger.info("Shift created/updated", { shiftId: newShift[0].id, eventId: shift.data.eventId });
      return Response.json(newShift[0]);
    } catch (error) {
      logger.error("Failed to create/update shift", error, { eventId: shift.data.eventId });
      return ApiErrorResponse.internalError("Failed to create/update shift", error);
    }
  } catch (error) {
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest("Invalid request body");
  }
}
