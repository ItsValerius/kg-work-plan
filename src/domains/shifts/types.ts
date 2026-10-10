import { shifts } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

export type Shift = typeof shifts.$inferSelect;

// Shared by the full form and the quick-add row, so both accept the same input.
const shiftNameSchema = z
  .string()
  .trim()
  .min(1, "Bitte gib der Schicht einen Namen.")
  .max(120, "Der Name ist zu lang (höchstens 120 Zeichen).");
const endsAfterStart = (shift: { startTime: Date; endTime: Date }) =>
  shift.endTime > shift.startTime;
const END_AFTER_START = { message: "Das Ende muss nach dem Beginn liegen.", path: ["endTime"] };

export const shiftSchema = createInsertSchema(shifts)
  .extend({
    name: shiftNameSchema,
    startTime: z.coerce.date<Date>(),
    endTime: z.coerce.date<Date>(),
  })
  .refine(endsAfterStart, END_AFTER_START);

export type ShiftInput = z.infer<typeof shiftSchema>;

export const quickAddShiftSchema = z
  .object({
    eventId: idSchema,
    name: shiftNameSchema,
    startTime: z.coerce.date<Date>({ error: "Bitte gib gültige Uhrzeiten an." }),
    endTime: z.coerce.date<Date>({ error: "Bitte gib gültige Uhrzeiten an." }),
  })
  .refine(endsAfterStart, END_AFTER_START);
