import { tasks } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type Task = typeof tasks.$inferSelect;
export type TaskInsert = typeof tasks.$inferInsert;

export const taskSchema = createInsertSchema(tasks).extend({
  startTime: z.preprocess(
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
  participantId: string;
  groupName: string | null;
  groupSize: number | null;
  requiredParticipants: number;
}
