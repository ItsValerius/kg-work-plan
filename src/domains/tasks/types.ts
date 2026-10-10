import { tasks } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

export type Task = typeof tasks.$inferSelect;

export const taskSchema = createInsertSchema(tasks).extend({
  name: z
    .string()
    .trim()
    .min(1, "Bitte gib der Aufgabe einen Namen.")
    .max(120, "Der Name ist zu lang (höchstens 120 Zeichen)."),
  description: z
    .string()
    .trim()
    .max(2000, "Die Beschreibung ist zu lang (höchstens 2000 Zeichen)."),
  requiredParticipants: z.coerce
    .number<number>()
    .int("Bitte gib eine ganze Zahl an.")
    .min(1, "Es muss mindestens eine Person gebraucht werden.")
    .max(999, "Höchstens 999 Personen."),
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
  name: z
    .string()
    .trim()
    .min(1, "Bitte gib der Aufgabe einen Namen.")
    .max(120, "Der Name ist zu lang (höchstens 120 Zeichen)."),
  startTime: z.coerce.date<Date>({ error: "Bitte gib eine gültige Uhrzeit an." }),
  requiredParticipants: z.coerce
    .number<number>()
    .int("Bitte gib eine ganze Zahl an.")
    .min(1, "Es muss mindestens eine Person gebraucht werden.")
    .max(999, "Höchstens 999 Personen."),
});

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
