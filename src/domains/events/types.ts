import { events } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type Event = typeof events.$inferSelect;
export type EventInsert = typeof events.$inferInsert;

export const eventSchema = createInsertSchema(events).extend({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type EventInput = z.infer<typeof eventSchema>;

export interface ParticipantCounts {
  currentParticipantsCount: number;
  requiredParticipantsCount: number;
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

export interface EventCardProps {
  event: Event;
  userIsAdmin: boolean;
  currentParticipantsCount: number;
  requiredParticipantsCount: number;
}

export interface ShiftIdMapValue {
  id: string;
  startTime: Date;
}
