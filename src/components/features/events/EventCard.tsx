import { EventAdminActions } from "@/components/features/admin/EventAdminActions";
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
import { formatEventDateRange } from "@/lib/datetime";
import type { EventCardProps } from "@/domains/events/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { deleteEvent } from "@/server/actions/events";

export const EventCard = ({
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

    const getProgressColor = () => {
        if (isFullyBooked || progressPercentage >= 67) {
            return "[&>div]:bg-green-600 dark:[&>div]:bg-green-500";
        }
        if (progressPercentage >= 34) {
            return "[&>div]:bg-orange-600 dark:[&>div]:bg-orange-500";
        }
        return "[&>div]:bg-red-600 dark:[&>div]:bg-red-500";
    };

    const participantsText = `${currentParticipantsCount} von ${requiredParticipantsCount} Personen`;

    return (
        <Card className="min-h-[280px] md:min-h-[340px] flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:border-primary/20 group">
            <CardHeader className="pb-3 lg:pb-5 flex flex-col justify-start relative">
                {userIsAdmin && (
                    <EventAdminActions
                        eventId={event.id}
                        eventName={event.name}
                        eventStartDate={event.startDate}
                        eventEndDate={event.endDate}
                        deleteAction={deleteEvent}
                    />
                )}
                <div className="flex-1 min-w-0 flex flex-col space-y-2 md:space-y-2.5 lg:flex lg:flex-col lg:gap-3">
                    <div className="lg:min-h-20 lg:pb-2">
                        <CardTitle className="wrap-break-word line-clamp-2 text-xl md:text-2xl leading-tight lg:leading-normal w-full">
                            {event.name}
                        </CardTitle>
                    </div>
                    <div className="lg:min-h-12">
                        {event.description ? (
                            <CardDescription className="wrap-break-word line-clamp-2 text-sm text-muted-foreground w-full">
                                {event.description}
                            </CardDescription>
                        ) : (
                            <div className="w-full" aria-hidden="true" />
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col grow pt-0">
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
                        <div className="flex items-center justify-between min-h-5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Teilnehmer
                            </span>
                            {isFullyBooked && (
                                <span className="text-xs font-semibold text-green-700 dark:text-green-300 flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-700 dark:bg-green-300"></span>
                                    Vollständig
                                </span>
                            )}
                        </div>
                        <Progress
                            value={progressPercentage}
                            aria-label={participantsText}
                            className={`h-2.5 ${getProgressColor()}`}
                        />
                        <small className="text-sm font-medium text-muted-foreground block">
                            {participantsText}
                        </small>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    asChild
                    variant="outline"
                    className="w-full transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <Link href={`/events/${event.id}`} className="flex items-center justify-center">
                        Aufgabenübersicht <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

