import DeleteButton from "@/components/DeleteButton";
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
import { events } from "@/db/schema";
import { getMissingUsersPerEvent } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { deleteEvent } from "./actions";

function EventSkeletonCard() {
    return (
        <Card className="h-[377px]">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-40" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-5 w-32" />
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Übersicht
                </h2>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Datum:
                    </h3>
                    <small className="text-sm font-medium leading-none flex gap-2">
                        <Skeleton className="h-5 w-20" /> -
                        <Skeleton className="h-5 w-20" />
                    </small>
                </div>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Aufgaben:
                    </h3>
                    <Progress value={null} />
                    <small className="text-sm font-medium leading-none flex mt-2">
                        <Skeleton className="h-5 w-32" />
                    </small>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant={"outline"}>
                    <Link href="#">
                        Aufgabenübersicht <ArrowRight />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

const EventCard = async ({
    event,
    userIsAdmin,
}: {
    event: typeof events.$inferSelect;
    userIsAdmin: boolean;
}) => {
    const { currentParticipantsCount, requiredParticipantsCount } =
        await getMissingUsersPerEvent(event.id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                {userIsAdmin && (
                    <div className="self-end absolute flex gap-2">
                        <DeleteButton
                            deleteAction={deleteEvent}
                            id={event.id}
                            className="w-fit "
                        />
                        <Link href={`events/${event.id}/edit`}>
                            <EditButton className="w-fit" />
                        </Link>
                    </div>
                )}
                <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Übersicht
                </h2>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Datum:
                    </h3>
                    <small className="text-sm font-medium leading-none">
                        {event.startDate.toLocaleDateString("DE-de", {
                            timeZone: "Europe/Berlin",
                        }) +
                            " - " +
                            event.endDate.toLocaleDateString("DE-de", {
                                timeZone: "Europe/Berlin",
                            })}
                    </small>
                </div>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Aufgaben:
                    </h3>
                    <Progress
                        className=""
                        value={(currentParticipantsCount / requiredParticipantsCount) * 100}
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
}: {
    events: (typeof events.$inferSelect)[];
    userIsAdmin: boolean;
    title: string;
    description: string;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
    emptyStateActionText?: string;
    showAddButton: boolean;
    isFutureEvents: boolean;
}) => {
    if (!isFutureEvents && eventsList.length === 0) {
        return null;
    }

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
                    {eventsList.map((event: typeof events.$inferSelect) => (
                        <Suspense key={event.id} fallback={<EventSkeletonCard />}>
                            <EventCard event={event} userIsAdmin={userIsAdmin} />
                        </Suspense>
                    ))}
                </div>
            )}
        </div>
    );
};

