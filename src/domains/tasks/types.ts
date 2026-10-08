import { tasks } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type Task = typeof tasks.$inferSelect;
export type TaskInsert = typeof tasks.$inferInsert;

export const taskSchema = createInsertSchema(tasks).extend({
  // Typed input is Date (what the form holds); JSON strings from the API
  // are still converted at runtime.
  startTime: z.preprocess<Date, z.ZodDate, Date>(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
});

export type TaskInput = z.infer<typeof taskSchema>;

export interface UserTask {
  id: string;
  name: string;
  description: string | null;
  shifts: string;
  startTime: Date | null;
  shiftDate: Date | null;
  shiftName: string;
  shiftEndTime: Date;
  eventId: string;
  eventName: string;
  participantId: string;
  groupName: string | null;
  groupSize: number | null;
  requiredParticipants: number;
}
