import { shifts } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type Shift = typeof shifts.$inferSelect;
export type ShiftInsert = typeof shifts.$inferInsert;

export const shiftSchema = createInsertSchema(shifts).extend({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export type ShiftInput = z.infer<typeof shiftSchema>;
