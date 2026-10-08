import { shifts } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

export type Shift = typeof shifts.$inferSelect;
export type ShiftInsert = typeof shifts.$inferInsert;

export const shiftSchema = createInsertSchema(shifts)
  .extend({
    name: z
      .string()
      .trim()
      .min(1, "Bitte gib der Schicht einen Namen.")
      .max(120, "Der Name ist zu lang (höchstens 120 Zeichen)."),
    startTime: z.coerce.date<Date>(),
    endTime: z.coerce.date<Date>(),
  })
  .refine((shift) => shift.endTime > shift.startTime, {
    message: "Das Ende muss nach dem Beginn liegen.",
    path: ["endTime"],
  });

export type ShiftInput = z.infer<typeof shiftSchema>;

export const quickAddShiftSchema = z
  .object({
    eventId: idSchema,
    name: z
      .string()
      .trim()
      .min(1, "Bitte gib der Schicht einen Namen.")
      .max(120, "Der Name ist zu lang (höchstens 120 Zeichen)."),
    startTime: z.coerce.date<Date>({ error: "Bitte gib gültige Uhrzeiten an." }),
    endTime: z.coerce.date<Date>({ error: "Bitte gib gültige Uhrzeiten an." }),
  })
  .refine((shift) => shift.endTime > shift.startTime, {
    message: "Das Ende muss nach dem Beginn liegen.",
    path: ["endTime"],
  });
