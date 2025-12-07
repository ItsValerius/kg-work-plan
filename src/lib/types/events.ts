import { events } from "@/db/schema";

export type Event = typeof events.$inferSelect;
export type EventInsert = typeof events.$inferInsert;

export interface ParticipantCounts {
  currentParticipantsCount: number;
  requiredParticipantsCount: number;
}

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

