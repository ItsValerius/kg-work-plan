import db from "@/db";
import { shifts, events } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getShiftById(shiftId: string) {
  return db.query.shifts.findFirst({
    where: eq(shifts.id, shiftId),
  });
}

export async function getShiftByIdWithEvent(eventId: string, shiftId: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      shifts: {
        where: eq(shifts.id, shiftId),
      },
    },
  });
  return event?.shifts[0] || null;
}
