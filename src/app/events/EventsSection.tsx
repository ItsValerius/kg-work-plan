import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import type { EventsSectionProps } from "@/domains/events/types";
import Link from "next/link";
import { Suspense } from "react";
import { EventsList } from "./EventsList";
import { EventsListSkeleton } from "./EventsListSkeleton";

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
    const titleClassName = "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl";

    return (
        <div>
            <div
                className={
                    isFutureEvents
                        ? "md:flex-row flex-col flex justify-between md:items-center mb-6 md:mb-8 min-h-[80px] md:min-h-[60px]"
                        : "mb-6 md:mb-8 min-h-[60px]"
                }
            >
                <div className="flex-1 min-w-0">
                    {isFutureEvents ? (
                        <h1 className={titleClassName}>{title}</h1>
                    ) : (
                        <h2 className={titleClassName}>{title}</h2>
                    )}
                    <small className="text-sm font-medium leading-none">
                        {description}
                    </small>
                </div>
                {canShowAddButton && (
                    <Button asChild className="shrink-0 mt-4 md:mt-0">
                        <Link href="/events/new">Veranstaltung hinzufügen</Link>
                    </Button>
                )}
            </div>

            {eventsList.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="flex flex-col items-center gap-4 text-center max-w-md">
                            <div className="rounded-full bg-muted p-4">
                                <svg
                                    className="h-8 w-8 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                {emptyStateTitle && (
                                    <h3 className="text-lg font-semibold">{emptyStateTitle}</h3>
                                )}
                                {emptyStateDescription && (
                                    <p className="text-sm text-muted-foreground">
                                        {emptyStateDescription}
                                    </p>
                                )}
                                {userIsAdmin && emptyStateActionText && (
                                    <p className="text-sm text-muted-foreground">
                                        {emptyStateActionText}
                                    </p>
                                )}
                            </div>
                            {canShowAddButton && (
                                <Button asChild className="mt-2">
                                    <Link href="/events/new">Veranstaltung erstellen</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Suspense fallback={<EventsListSkeleton />}>
                    <EventsList events={eventsList} userIsAdmin={userIsAdmin} />
                </Suspense>
            )}
        </div>
    );
};

