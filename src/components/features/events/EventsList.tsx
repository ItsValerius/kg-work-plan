import { getMissingUsersPerEvents } from "@/domains/events/queries";
import type { Event } from "@/domains/events/types";
import { EventRow } from "./EventRow";

interface EventsListProps {
    events: Event[];

    isPast?: boolean;
}

export const EventsList = async ({ events, isPast = false }: EventsListProps) => {
    if (events.length === 0) {
        return null;
    }

    const participantCounts = await getMissingUsersPerEvents(events.map((event) => event.id));

    return (
        <ol className="border-t">
            {events.map((event) => {
                const counts = participantCounts[event.id] ?? {
                    currentParticipantsCount: 0,
                    requiredParticipantsCount: 0,
                    openSpotsCount: 0,
                };
                return (
                    <EventRow
                        key={event.id}
                        event={event}
                        openSpots={counts.openSpotsCount}
                        requiredSpots={counts.requiredParticipantsCount}
                        isPast={isPast}
                    />
                );
            })}
        </ol>
    );
};
