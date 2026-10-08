import { Button } from "@/components/ui/button";
import type { EventsSectionProps } from "@/domains/events/types";
import Link from "next/link";
import { Suspense } from "react";
import { EventsList } from "./EventsList";
import { EventsListSkeleton } from "@/components/layout/Skeletons";

export const EventsSection = ({
    events: eventsList,
    userIsAdmin,
    title,
    description,
    emptyStateTitle,
    emptyStateDescription,
    emptyStateActionText,
    showAddButton,
    isFutureEvents,
}: EventsSectionProps) => {
    if (!isFutureEvents && eventsList.length === 0) {
        return null;
    }

    const canShowAddButton = showAddButton && userIsAdmin;

    return (
        <section aria-labelledby={isFutureEvents ? "events-heading" : "past-events-heading"}>
            <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                    {isFutureEvents ? (
                        <h1 id="events-heading" className="text-[48px] md:text-[clamp(56px,5.7vw,80px)]">
                            {title}
                        </h1>
                    ) : (
                        <h2 id="past-events-heading" className="text-[34px] md:text-[44px]">
                            {title}
                        </h2>
                    )}
                    <p className="mt-3 max-w-[60ch] text-[17px] text-muted-foreground">{description}</p>
                </div>
            </div>

            {eventsList.length === 0 ? (
                <div className="rounded-xl border bg-muted px-6 py-10 md:px-10">
                    {emptyStateTitle && (
                        <h2 className="text-[32px]">{emptyStateTitle}</h2>
                    )}
                    {emptyStateDescription && (
                        <p className="mt-2 text-[17px] text-muted-foreground">{emptyStateDescription}</p>
                    )}
                    {userIsAdmin && emptyStateActionText && (
                        <p className="mt-1 text-[17px] text-muted-foreground">{emptyStateActionText}</p>
                    )}
                    {canShowAddButton && (
                        <Button asChild className="mt-6">
                            <Link href="/dashboard/events/new">In der Organisation anlegen</Link>
                        </Button>
                    )}
                </div>
            ) : (
                <Suspense fallback={<EventsListSkeleton />}>
                    <EventsList events={eventsList} isPast={!isFutureEvents} />
                </Suspense>
            )}
        </section>
    );
};
