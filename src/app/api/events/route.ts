import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import db from "@/db/index";
import { events } from "@/db/schema";
import { ApiErrorResponse } from "@/lib/api-errors";
import { isAdmin } from "@/lib/auth/utils";
import { logger } from "@/lib/logger";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

const eventSchema = createInsertSchema(events).extend({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id || !(await isAdmin())) {
    return ApiErrorResponse.unauthorized();
  }

  try {
    const body = await request.json();
    const event = eventSchema.safeParse(body);

    if (!event.success) {
      logger.warn("Invalid event data", { errors: event.error.errors });
      return ApiErrorResponse.validationError(event.error.message);
    }

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
      logger.info("Event created/updated", { eventId: newEvent[0].id, userId: session.user.id });
      return Response.json(newEvent[0]);
    } catch (error) {
      logger.error("Failed to create/update event", error, { userId: session.user.id });
      return ApiErrorResponse.internalError("Failed to create/update event", error);
    }
  } catch (error) {
    logger.error("Invalid request body", error);
    return ApiErrorResponse.badRequest("Invalid request body");
  }
}
