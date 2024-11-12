// app/events/[eventId]/page.tsx
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import db from "@/db/index";
import { events, taskParticipants, tasks } from "@/db/schema/index";
import { isAdmin, isLoggedIn } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { deleteShift, deleteTask } from "./actions";

export default async function EventPage(props: {
  params: Promise<{ eventId: string }>;
}) {
  const params = await props.params;
  const userIsAdmin = await isAdmin();
  const userIsLoggedIn = await isLoggedIn();
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
      <div className="flex justify-between mb-6 flex-col">
        <Button asChild variant="outline" className="w-fit">
          <Link href="/events">
            {" "}
            <ArrowLeft />
            Zurück
          </Link>
        </Button>
        <div>
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
        {userIsAdmin && (
          <Button asChild className="w-fit self-end">
            <Link href={`/events/${event.id}/shifts/new`}>
              Schicht hinzufügen
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {event.shifts.map((shift) => (
          <Card key={shift.id} className=" p-4">
            <CardHeader>
              <CardTitle>{shift.name}</CardTitle>

              <CardDescription>
                {new Date(shift.startTime).toLocaleTimeString("de-DE", {
                  timeZone: "Europe/Berlin",
                  hour: "numeric",
                  minute: "numeric",
                }) +
                  " - " +
                  new Date(shift.endTime).toLocaleTimeString("de-DE", {
                    timeZone: "Europe/Berlin",
                    hour: "numeric",
                    minute: "numeric",
                  })}
              </CardDescription>
              {userIsAdmin && (
                <>
                  <div className="absolute self-end flex gap-2">
                    <DeleteButton
                      id={shift.id}
                      deleteAction={deleteShift}
                      className="w-fit "
                    />
                    <Link href={`/events/${event.id}/shifts/${shift.id}/edit`}>
                      <EditButton className={"w-fit"} />
                    </Link>
                  </div>
                  <Button asChild className="w-fit self-end">
                    <Link
                      href={`/events/${event.id}/shifts/${shift.id}/tasks/new`}
                    >
                      Aufgabe Hinzufügen
                    </Link>
                  </Button>
                </>
              )}
            </CardHeader>

            <CardContent className="grid gap-4 lg:grid-cols-4">
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
  isLoggedIn,
}: {
  eventId: string;
  shiftId: string;
  task: typeof tasks.$inferSelect;
  isAdmin: boolean;
  isLoggedIn: boolean;
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
    <Card className="flex flex-col ">
      <CardHeader>
        <CardTitle className="font-medium">{task.name}</CardTitle>
        {isAdmin && (
          <div className="self-end absolute flex gap-2">
            <DeleteButton
              className="w-fit "
              id={task.id}
              deleteAction={deleteTask}
            />
            <Link
              href={`/events/${eventId}/shifts/${shiftId}/tasks/${task.id}/edit`}
            >
              <EditButton className="w-fit" />
            </Link>
          </div>
        )}
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

      <CardContent className="mt-auto">
        <Dialog>
          <DialogTrigger>Bereits eingetragen</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="border-b">Übersicht</DialogTitle>

              {isLoggedIn
                ? participants.map((participant) => {
                    return (
                      <span key={participant.id}>
                        {participant.groupName
                          ? participant.groupName
                          : participant.user?.name || "-"}
                        {participant.groupSize > 1 &&
                          "(" + participant.groupSize + ")"}
                      </span>
                    );
                  })
                : "Melde dich an um andere Teilnehmer zu sehen."}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter>
        <Button
          asChild={task.requiredParticipants > participantsAmount}
          disabled={participantsAmount >= task.requiredParticipants}
          className="text-wrap disabled:cursor-not-allowed"
        >
          <Link
            href={
              participantsAmount >= task.requiredParticipants
                ? "#"
                : `/events/${eventId}/shifts/${shiftId}/tasks/${task.id}`
            }
          >
            {participantsAmount >= task.requiredParticipants
              ? "Vollständig besetzt"
              : "Zur Aufgabe anmelden"}{" "}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
