// app/events/[eventId]/page.tsx
import { auth } from "@/auth";
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
import db from "@/db/index";
import { events, taskParticipants, tasks } from "@/db/schema/index";
import { isAdmin } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function EventPage(props: {
  params: Promise<{ eventId: string }>;
}) {
  const user = (await auth())?.user;
  const params = await props.params;
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
    with: {
      shifts: {
        with: {
          tasks: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button asChild variant="outline">
            <Link href="/events">
              {" "}
              <ArrowLeft />
              Zurück
            </Link>
          </Button>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {event.name}
          </h1>
          <small className="text-sm font-medium leading-none">
            {event.startDate.toLocaleDateString("de-DE") +
              " - " +
              event.endDate.toLocaleDateString("de-DE")}
          </small>
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>
        {isAdmin(user) && (
          <Button asChild>
            <Link href={`/events/${event.id}/shifts/new`}>
              Schicht hinzufügen
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {event.shifts.map((shift) => (
          <Card key={shift.id} className=" p-4">
            <CardHeader className="flex justify-between items-center flex-row">
              <div>
                <h2 className="scroll-m-20  text-3xl font-semibold tracking-tight first:mt-0">
                  {shift.name}
                </h2>
                <small>
                  {shift.startTime.toLocaleTimeString("de-DE", {
                    hour: "numeric",
                    minute: "numeric",
                  }) +
                    " - " +
                    shift.endTime.toLocaleTimeString("de-DE", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                </small>
              </div>
              {isAdmin(user) && (
                <Button asChild variant={"secondary"}>
                  <Link
                    href={`/events/${event.id}/shifts/${shift.id}/tasks/new`}
                  >
                    Aufgabe Hinzufügen
                  </Link>
                </Button>
              )}
            </CardHeader>

            <CardContent className="grid gap-4 md:grid-cols-4">
              {shift.tasks.map((task) => (
                <Suspense key={task.id} fallback={<SkeletonCard />}>
                  <TaskCard
                    eventId={event.id}
                    shiftId={shift.id}
                    task={task}
                    isAdmin={isAdmin(user)}
                  />
                </Suspense>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card className="h-[188px]">
      <CardHeader>
        <CardTitle className="font-medium">
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          <Skeleton className="h-5 w-32" />
        </CardDescription>
      </CardHeader>
      <CardContent> </CardContent>
      <CardFooter>
        <Button asChild className="text-wrap">
          <Link href={"#"}>Zur Aufgabe anmelden</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

async function TaskCard({
  eventId,
  shiftId,
  task,
  isAdmin,
}: {
  eventId: string;
  shiftId: string;
  task: typeof tasks.$inferSelect;
  isAdmin: boolean;
}) {
  const participants = await db.query.taskParticipants.findMany({
    where: eq(taskParticipants.taskId, task.id),
    with: {
      user: true,
    },
  });
  const participantsAmount = participants.reduce(
    (accumulator, participant) => accumulator + participant.groupSize,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-medium">{task.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={(participantsAmount / task.requiredParticipants) * 100}
        />
        <small className="text-sm font-medium leading-none">
          {participantsAmount} von {task.requiredParticipants} Personen
        </small>
      </CardContent>

      <CardContent>
        {isAdmin &&
          participants.map((participant) => (
            <ul
              className="my-6 ml-6 list-disc [&>li]:mt-2"
              key={participant.id}
            >
              <li> Email: {participant.user?.email}</li>

              {participant.groupName && (
                <li className="ml-4">
                  Gruppenname: {participant.groupName} ({participant.groupSize})
                </li>
              )}
            </ul>
          ))}
      </CardContent>
      <CardFooter>
        <Button asChild className="text-wrap">
          <Link href={`/events/${eventId}/shifts/${shiftId}/tasks/${task.id}`}>
            Zur Aufgabe anmelden
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
