import { getMissingUsersPerEvents } from "@/domains/events/queries";
import type { Event } from "@/domains/events/types";
import { EventCard } from "./EventCard";

interface EventsListProps {
    events: Event[];
    userIsAdmin: boolean;
}

export const EventsList = async ({ events, userIsAdmin }: EventsListProps) => {
    if (events.length === 0) {
        return null;
    }

    const participantCounts = await getMissingUsersPerEvents(events.map((event) => event.id));

    return (
        <div className="lg:grid lg:grid-cols-3 gap-4 md:gap-6 flex flex-col lg:items-stretch min-h-72">
            {events.map((event) => {
                const counts = participantCounts[event.id] ?? {
                    currentParticipantsCount: 0,
                    requiredParticipantsCount: 0,
                };
                return (
                    <EventCard
                        key={event.id}
                        event={event}
                        userIsAdmin={userIsAdmin}
                        currentParticipantsCount={counts.currentParticipantsCount}
                        requiredParticipantsCount={counts.requiredParticipantsCount}
                    />
                );
            })}
        </div>
    );
};

