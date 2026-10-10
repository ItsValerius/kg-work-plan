import { events } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { idSchema } from "@/lib/validation";

export type Event = typeof events.$inferSelect;

// Shared by the event form and duplicating, so both accept the same input.
const eventNameSchema = z
  .string()
  .trim()
  .min(1, "Bitte gib der Veranstaltung einen Namen.")
  .max(120, "Der Name ist zu lang (höchstens 120 Zeichen).");
const endsNotBeforeStart = (event: { startDate: Date; endDate: Date }) =>
  event.endDate >= event.startDate;
const END_NOT_BEFORE_START = {
  message: "Das Ende darf nicht vor dem Beginn liegen.",
  path: ["endDate"],
};

// The DB columns only forbid NULL, so empty strings and reversed dates are checked here;
// forms and the API both validate with this schema.
export const eventSchema = createInsertSchema(events)
  .extend({
    name: eventNameSchema,
    description: z
      .string()
      .trim()
      .max(2000, "Die Beschreibung ist zu lang (höchstens 2000 Zeichen)."),
    startDate: z.coerce.date<Date>(),
    endDate: z.coerce.date<Date>(),
  })
  .refine(endsNotBeforeStart, END_NOT_BEFORE_START);

export type EventInput = z.infer<typeof eventSchema>;

export const duplicateEventSchema = z
  .object({
    eventId: idSchema,
    name: eventNameSchema,
    startDate: z.coerce.date<Date>(),
    endDate: z.coerce.date<Date>(),
  })
  .refine(endsNotBeforeStart, END_NOT_BEFORE_START);

export interface ParticipantCounts {
  currentParticipantsCount: number;
  requiredParticipantsCount: number;
  /** Spots still free, summed per task, so an overstaffed task can't hide another task's gap. */
  openSpotsCount: number;
}

export type EventParticipantCounts = Record<string, ParticipantCounts>;

export interface EventsSectionProps {
  /** Awaited inside the section's Suspense boundary, so the heading renders right away. */
  events: Promise<Event[]>;
  userIsAdmin: Promise<boolean>;
  title: string;
  description: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateActionText?: string;
  showAddButton: boolean;
  isFutureEvents: boolean;
}
