import DeleteButton from "@/components/DeleteButton";
import DuplicateButton from "@/components/DuplicateButton";
import EditButton from "@/components/EditButton";
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
        <Card className="min-h-[377px] flex flex-col">
            <CardHeader className="relative">
                <CardTitle>
                    <Skeleton className="h-7 w-48" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 flex-grow">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Übersicht
                </h2>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Datum:
                    </h3>
                    <small className="text-sm font-medium leading-none flex gap-2 mt-1">
                        <Skeleton className="h-4 w-24" />
                        <span className="hidden"> - </span>
                        <Skeleton className="h-4 w-24" />
                    </small>
                </div>
                <div className="mt-2">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Aufgaben:
                    </h3>
                    <Progress value={null} className="mt-1" />
                    <small className="text-sm font-medium leading-none flex mt-2">
                        <Skeleton className="h-4 w-36" />
                    </small>
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
    return (
        <Card className="min-h-[377px] flex flex-col">
            <CardHeader className={userIsAdmin ? "pb-4" : ""}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="break-words">{event.name}</CardTitle>
                        <CardDescription className="mt-2 break-words">
                            {event.description}
                        </CardDescription>
                    </div>
                    {userIsAdmin && (
                        <div className="flex gap-2 shrink-0">
                            <Link href={`events/${event.id}/edit`}>
                                <EditButton className="w-fit" />
                            </Link>
                            <DuplicateButton
                                eventId={event.id}
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
            <CardContent className="flex flex-col gap-2 flex-grow">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Übersicht
                </h2>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Datum:
                    </h3>
                    <small className="text-sm font-medium leading-none">
                        {formatEventDateRange(event.startDate, event.endDate)}
                    </small>
                </div>
                <div className="mt-2">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Aufgaben:
                    </h3>
                    <Progress
                        value={
                            requiredParticipantsCount > 0
                                ? (currentParticipantsCount / requiredParticipantsCount) * 100
                                : 0
                        }
                        className="mt-1"
                    />
                    <small className="text-sm font-medium leading-none">
                        {currentParticipantsCount +
                            " von " +
                            requiredParticipantsCount +
                            " Personen"}
                    </small>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant={"outline"}>
                    <Link href={`/events/${event.id}`}>
                        Aufgabenübersicht <ArrowRight />
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
        <div className={isFutureEvents ? "" : "mt-12"}>
            <div
                className={
                    isFutureEvents
                        ? "md:flex-row flex-col flex justify-between md:items-center mb-6"
                        : "mb-6"
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
                <Card className="p-8 text-center bg-gray-50">
                    {emptyStateTitle && (
                        <CardHeader>
                            <CardTitle>{emptyStateTitle}</CardTitle>
                        </CardHeader>
                    )}
                    {emptyStateDescription && (
                        <CardContent>
                            <CardDescription>
                                {emptyStateDescription}
                                {userIsAdmin && emptyStateActionText && (
                                    <span className="block mt-2">{emptyStateActionText}</span>
                                )}
                            </CardDescription>
                        </CardContent>
                    )}
                    {userIsAdmin && showAddButton && (
                        <CardFooter className="justify-center">
                            <Button asChild>
                                <Link href="/events/new">Veranstaltung erstellen</Link>
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            ) : (
                <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col">
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

