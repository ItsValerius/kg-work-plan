import { ShiftAdminActions } from "@/components/features/admin/ShiftAdminActions";
import BackButton from "@/components/shared/buttons/BackButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAdmin, isLoggedIn } from "@/lib/auth/utils";
import { formatDateTimeRange } from "@/lib/datetime";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TaskCard } from "@/components/features/tasks/TaskCard";
import { SkeletonCard } from "@/components/features/tasks/SkeletonCard";
import { deleteShift } from "@/server/actions/events";
import DuplicateButton from "@/components/shared/buttons/DuplicateButton";
import { getEventWithShifts } from "@/domains/events/queries";
import { PageContainer } from "@/components/layout/PageContainer";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventPage(props: EventPageProps) {
  const params = await props.params;

  const [userIsAdmin, userIsLoggedIn, event] = await Promise.all([
    isAdmin(),
    isLoggedIn(),
    getEventWithShifts(params.eventId),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="mb-4">
        <BackButton className="h-9" />
      </div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="flex-1 min-w-0">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl wrap-break-word">
            {event.name}
          </h1>
          <small className="text-sm md:text-base font-medium leading-none block mt-2 md:mt-3 text-muted-foreground">
            {formatDateTimeRange(event.startDate, event.endDate)}
          </small>
          {event.description && (
            <p className="text-sm md:text-base text-muted-foreground mt-3 md:mt-4 wrap-break-word max-w-3xl leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {userIsAdmin && (
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <DuplicateButton
              eventId={event.id}
              eventName={event.name}
              eventStartDate={event.startDate}
              eventEndDate={event.endDate}
              className="w-full sm:w-fit"
              showText
            />
            <Button asChild className="w-full sm:w-fit h-10 md:h-11">
              <Link href={`/events/${event.id}/shifts/new`}>
                Schicht hinzufügen
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6 md:space-y-8 lg:space-y-10">
        {event.shifts.map((shift) => (
          <Card key={shift.id} className="overflow-hidden">
            <CardHeader className="pb-4 md:pb-5 relative">
              {userIsAdmin && (
                <ShiftAdminActions
                  eventId={event.id}
                  shiftId={shift.id}
                  deleteAction={deleteShift}
                />
              )}
              <div className="flex items-start justify-between gap-4 md:gap-6 mb-4 md:mb-5">
                <div className="flex-1 min-w-0">
                  <CardTitle className="wrap-break-word text-xl md:text-2xl font-semibold">
                    {shift.name}
                  </CardTitle>
                  <CardDescription className="mt-2 md:mt-3 wrap-break-word text-sm md:text-base">
                    {formatDateTimeRange(
                      new Date(shift.startTime),
                      new Date(shift.endTime),
                      false
                    )}
                  </CardDescription>
                </div>
              </div>
              {userIsAdmin && (
                <Button asChild className="w-fit h-9 md:h-10">
                  <Link
                    href={`/events/${event.id}/shifts/${shift.id}/tasks/new`}
                  >
                    Aufgabe Hinzufügen
                  </Link>
                </Button>
              )}
            </CardHeader>

            <CardContent className="grid gap-3 md:gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
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
    </PageContainer>
  );
}
