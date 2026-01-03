"use client";

import { EventStatistics } from "./EventStatistics";
import { EventStat } from "../shared/types";

interface EventsContentProps {
  eventStats: EventStat[];
}

export function EventsContent({ eventStats }: EventsContentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Veranstaltungs-Statistiken</h2>
      <p className="text-muted-foreground">
        Detaillierte Übersicht über alle Veranstaltungen, Schichten und Aufgaben mit Teilnehmer-Status.
      </p>
      <EventStatistics events={eventStats} />
    </div>
  );
}

