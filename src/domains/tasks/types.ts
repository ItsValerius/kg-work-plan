import { tasks } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

export type Task = typeof tasks.$inferSelect;

// Shared by the full form and the quick-add row, so both accept the same input.
const taskNameSchema = z
  .string()
  .trim()
  .min(1, "Bitte gib der Aufgabe einen Namen.")
  .max(120, "Der Name ist zu lang (höchstens 120 Zeichen).");
const requiredParticipantsSchema = z.coerce
  .number<number>()
  .int("Bitte gib eine ganze Zahl an.")
  .min(1, "Es muss mindestens eine Person gebraucht werden.")
  .max(999, "Höchstens 999 Personen.");

export const taskSchema = createInsertSchema(tasks).extend({
  name: taskNameSchema,
  description: z
    .string()
    .trim()
    .max(2000, "Die Beschreibung ist zu lang (höchstens 2000 Zeichen)."),
  requiredParticipants: requiredParticipantsSchema,
  // Typed input is Date (what the form holds); JSON strings from the API
  // are still converted at runtime.
  startTime: z.preprocess<Date, z.ZodDate, Date>(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date(),
  ),
});

export type TaskInput = z.infer<typeof taskSchema>;

export const quickAddTaskSchema = z.object({
  shiftId: idSchema,
  name: taskNameSchema,
  startTime: z.coerce.date<Date>({ error: "Bitte gib eine gültige Uhrzeit an." }),
  requiredParticipants: requiredParticipantsSchema,
});
