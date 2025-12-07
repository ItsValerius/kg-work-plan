import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/index";
import { events, shifts, tasks } from "@/db/schema/index";
import { isAdmin, isLoggedIn } from "@/lib/auth/utils";
import { logger } from "@/lib/logger";
import { formatDateTimeRange } from "@/lib/formatters";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TaskCard } from "./TaskCard";
import { SkeletonCard } from "./SkeletonCard";
import { deleteShift } from "./actions";
import DuplicateButton from "@/components/DuplicateButton";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventPage(props: EventPageProps) {
  const params = await props.params;

  try {
    const userIsAdmin = await isAdmin();
    const userIsLoggedIn = await isLoggedIn();

    const event = await db.query.events.findFirst({
      where: eq(events.id, params.eventId),
      with: {
        shifts: {
          orderBy: shifts.startTime,
          with: {
            tasks: { orderBy: tasks.startTime },
          },
        },
      },
    });

    if (!event) {
      notFound();
    }

    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between mb-6 flex-col">
          <Button asChild variant="outline" className="w-fit">
            <Link href="/events">
              <ArrowLeft />
              Zurück
            </Link>
          </Button>

          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {event.name}
            </h1>
            <small className="text-sm font-medium leading-none">
              {formatDateTimeRange(event.startDate, event.endDate)}
            </small>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>

          {userIsAdmin && (
            <div className="flex gap-2 w-fit self-end">
              <DuplicateButton
                eventId={event.id}
                eventName={event.name}
                eventStartDate={event.startDate}
                eventEndDate={event.endDate}
                className="w-fit"
                showText
              />
              <Button asChild>
                <Link href={`/events/${event.id}/shifts/new`}>
                  Schicht hinzufügen
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {event.shifts.map((shift) => (
            <Card key={shift.id} className="p-4">
              <CardHeader className={userIsAdmin ? "pb-4" : ""}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="break-words">{shift.name}</CardTitle>
                    <CardDescription className="mt-2 break-words">
                      {formatDateTimeRange(
                        new Date(shift.startTime),
                        new Date(shift.endTime),
                        false
                      )}
                    </CardDescription>
                  </div>
                  {userIsAdmin && (
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/events/${event.id}/shifts/${shift.id}/edit`}
                        aria-label={`Edit shift ${shift.name}`}
                      >
                        <EditButton className="w-fit" />
                      </Link>
                      <DeleteButton
                        id={shift.id}
                        deleteAction={deleteShift}
                        className="w-fit"
                      />
                    </div>
                  )}
                </div>
                {userIsAdmin && (
                  <Button asChild className="w-fit">
                    <Link
                      href={`/events/${event.id}/shifts/${shift.id}/tasks/new`}
                    >
                      Aufgabe Hinzufügen
                    </Link>
                  </Button>
                )}
              </CardHeader>

              <CardContent className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
                {shift.tasks.map((task) => (
                  <Suspense key={task.id} fallback={<SkeletonCard />}>
                    <TaskCard
                      eventId={event.id}
                      shiftId={shift.id}
                      task={task}
                      isAdmin={userIsAdmin}
                      isLoggedIn={userIsLoggedIn}
                    />
                  </Suspense>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    logger.error("Error loading event page", error, { eventId: params.eventId });
    throw new Error("Failed to load event data. Please try again later.");
  }
}
