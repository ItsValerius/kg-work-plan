import DeleteButton from "@/components/buttons/DeleteButton";
import DuplicateButton from "@/components/buttons/DuplicateButton";
import EditButton from "@/components/buttons/EditButton";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEventDateRange } from "@/lib/date-utils";
import { getMissingUsersPerEvents } from "@/lib/utils";
import type { EventCardProps, EventsSectionProps } from "@/lib/types/events";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { deleteEvent } from "./actions";

export function EventSkeletonCard() {
    return (
        <Card className="min-h-[280px] md:min-h-[340px] flex flex-col">
            <CardHeader className="pb-5 lg:h-[140px] flex flex-col justify-start">
                <div className="flex items-start justify-between gap-4 h-full">
                    <div className="flex-1 min-w-0 flex flex-col space-y-2 md:space-y-2.5 lg:grid lg:grid-rows-[3.5rem_3rem] lg:gap-2.5 lg:h-full">
                        <div className="flex items-start lg:h-[3.5rem]">
                            <Skeleton className="h-7 w-48" />
                        </div>
                        <div className="flex items-start lg:h-[3rem]">
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow pt-0">
                <div className="space-y-3 md:space-y-4">
                    <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                            Datum
                        </span>
                        <Skeleton className="h-4 w-48" />
                    </div>

                    <div className="space-y-2 pt-2 md:pt-3 border-t">
                        <div className="flex items-center justify-between min-h-[1.25rem]">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Teilnehmer
                            </span>
                        </div>
                        <Progress value={null} className="h-2.5" />
                        <div className="min-h-[1.25rem]">
                            <Skeleton className="h-4 w-36" />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant={"outline"} disabled className="w-full">
                    <Skeleton className="h-4 w-32" />
                    <ArrowRight className="ml-2" />
                </Button>
            </CardFooter>
        </Card>
    );
}

const EventCard = ({
    event,
    userIsAdmin,
    currentParticipantsCount,
    requiredParticipantsCount,
}: EventCardProps) => {
    const progressPercentage =
        requiredParticipantsCount > 0
            ? (currentParticipantsCount / requiredParticipantsCount) * 100
            : 0;
    const isFullyBooked = progressPercentage >= 100;

    return (
        <Card className="min-h-[280px] md:min-h-[340px] flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:border-primary/20 group">
            <CardHeader className="pb-3 md:pb-5 lg:pb-5 lg:h-[140px] flex flex-col justify-start">
                <div className="flex items-start justify-between gap-3 lg:gap-4 h-full">
                    <div className="flex-1 min-w-0 flex flex-col space-y-2 md:space-y-2.5 lg:grid lg:grid-rows-[3.5rem_3rem] lg:gap-2.5 lg:h-full">
                        <div className="flex items-start lg:h-[3.5rem]">
                            <CardTitle className="break-words line-clamp-2 text-xl md:text-2xl leading-tight w-full">
                                {event.name}
                            </CardTitle>
                        </div>
                        <div className="flex items-start lg:h-[3rem]">
                            {event.description ? (
                                <CardDescription className="break-words line-clamp-2 text-sm text-muted-foreground w-full">
                                    {event.description}
                                </CardDescription>
                            ) : (
                                <div className="h-0 w-full" aria-hidden="true"></div>
                            )}
                        </div>
                    </div>
                    {userIsAdmin && (
                        <div className="flex gap-2 shrink-0">
                            <Link href={`events/${event.id}/edit`}>
                                <EditButton className="w-fit" />
                            </Link>
                            <DuplicateButton
                                eventId={event.id}
                                eventName={event.name}
                                eventStartDate={event.startDate}
                                eventEndDate={event.endDate}
                                className="w-fit"
                            />
                            <DeleteButton
                                deleteAction={deleteEvent}
                                id={event.id}
                                className="w-fit"
                            />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow pt-0">
                <div className="space-y-3 md:space-y-4">
                    <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                            Datum
                        </span>
                        <p className="text-sm font-medium text-foreground leading-relaxed">
                            {formatEventDateRange(event.startDate, event.endDate)}
                        </p>
                    </div>

                    <div className="space-y-2 pt-2 md:pt-3 border-t">
                        <div className="flex items-center justify-between min-h-[1.25rem]">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Teilnehmer
                            </span>
                            {isFullyBooked && (
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                                    Vollständig
                                </span>
                            )}
                        </div>
                        <Progress
                            value={progressPercentage}
                            className={`h-2.5 ${isFullyBooked
                                ? "[&>div]:bg-green-500"
                                : progressPercentage >= 67
                                    ? "[&>div]:bg-green-500"
                                    : progressPercentage >= 34
                                        ? "[&>div]:bg-orange-500"
                                        : "[&>div]:bg-red-500"
                                }`}
                        />
                        <div className="flex items-center justify-between min-h-[1.25rem]">
                            <small className="text-sm font-medium text-muted-foreground">
                                {currentParticipantsCount +
                                    " von " +
                                    requiredParticipantsCount +
                                    " Personen"}
                            </small>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    asChild
                    variant={"outline"}
                    className="w-full transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <Link href={`/events/${event.id}`} className="flex items-center justify-center">
                        Aufgabenübersicht{" "}
                        <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export const EventsSection = async ({
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

    // Batch load participant counts for all events
    const eventIds = eventsList.map((event) => event.id);
    const participantCounts = await getMissingUsersPerEvents(eventIds);

    const titleClassName =
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl";

    return (
        <div>
            <div
                className={
                    isFutureEvents
                        ? "md:flex-row flex-col flex justify-between md:items-center mb-6 md:mb-8"
                        : "mb-6 md:mb-8"
                }
            >
                <div>
                    {isFutureEvents ? (
                        <h1 className={titleClassName}>{title}</h1>
                    ) : (
                        <h2 className={titleClassName}>{title}</h2>
                    )}
                    <small className="text-sm font-medium leading-none">
                        {description}
                    </small>
                </div>
                {showAddButton && userIsAdmin && (
                    <Button asChild>
                        <Link href={`/events/new`}>Veranstaltung hinzufügen</Link>
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
                            {userIsAdmin && showAddButton && (
                                <Button asChild className="mt-2">
                                    <Link href="/events/new">Veranstaltung erstellen</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="lg:grid lg:grid-cols-3 gap-4 md:gap-6 flex flex-col lg:items-stretch">
                    {eventsList.map((event) => {
                        const counts = participantCounts[event.id] || {
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
            )}
        </div>
    );
};

