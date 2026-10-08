import { events } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

export type Event = typeof events.$inferSelect;
export type EventInsert = typeof events.$inferInsert;

// The DB columns only forbid NULL, so empty strings and reversed dates are checked here;
// forms and the API both validate with this schema.
export const eventSchema = createInsertSchema(events)
  .extend({
    name: z
      .string()
      .trim()
      .min(1, "Bitte gib der Veranstaltung einen Namen.")
      .max(120, "Der Name ist zu lang (höchstens 120 Zeichen)."),
    description: z
      .string()
      .trim()
      .max(2000, "Die Beschreibung ist zu lang (höchstens 2000 Zeichen)."),
    startDate: z.coerce.date<Date>(),
    endDate: z.coerce.date<Date>(),
  })
  .refine((event) => event.endDate >= event.startDate, {
    message: "Das Ende darf nicht vor dem Beginn liegen.",
    path: ["endDate"],
  });

export type EventInput = z.infer<typeof eventSchema>;

export const duplicateEventSchema = z
  .object({
    eventId: idSchema,
    name: z
      .string()
      .trim()
      .min(1, "Bitte gib der Veranstaltung einen Namen.")
      .max(120, "Der Name ist zu lang (höchstens 120 Zeichen)."),
    startDate: z.coerce.date<Date>(),
    endDate: z.coerce.date<Date>(),
  })
  .refine((event) => event.endDate >= event.startDate, {
    message: "Das Ende darf nicht vor dem Beginn liegen.",
    path: ["endDate"],
  });

export interface ParticipantCounts {
  currentParticipantsCount: number;
  requiredParticipantsCount: number;
  /** Spots still free, summed per task, so an overstaffed task can't hide another task's gap. */
  openSpotsCount: number;
}

export type EventParticipantCounts = Record<string, ParticipantCounts>;

export interface EventsSectionProps {
  events: Event[];
  userIsAdmin: boolean;
  title: string;
  description: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateActionText?: string;
  showAddButton: boolean;
  isFutureEvents: boolean;
}

export interface ShiftIdMapValue {
  id: string;
  startTime: Date;
}
