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
import db from "@/db";
import { events } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { getMissingUsersPerEvent } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const EventsPage = async () => {
  const events = await db.query.events.findMany({});

  const user = (await auth())?.user;
  return (
    <main className="container mx-auto py-8 ">
      <div className="md:flex-row flex-col flex justify-between md:items-center mb-6">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Bevorstehende Veranstaltungen
          </h1>
          <small className="text-sm font-medium leading-none">
            Hier findest du alle Bevorstehenden Veranstaltungen
          </small>
        </div>
        {isAdmin(user) && (
          <Button asChild>
            <Link href={`/events/new`}>Event hinzufügen</Link>
          </Button>
        )}
      </div>
      <div className="md:grid md:grid-cols-3 gap-4 flex flex-col">
        {events.map((event) => {
          return (
            <Suspense key={event.id} fallback={<EventSkeletonCard />}>
              <EventCard {...event} />
            </Suspense>
          );
        })}
      </div>
    </main>
  );
};

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

const EventCard = async (event: typeof events.$inferSelect) => {
  const missingUsers = await getMissingUsersPerEvent();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
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
            {event.startDate.toLocaleDateString("DE-de") +
              " - " +
              event.endDate.toLocaleDateString("DE-de")}
          </small>
        </div>
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Aufgaben:
          </h3>
          <Progress
            className=""
            value={
              (Number(
                missingUsers.find(
                  (missingUser) => missingUser.eventId === event.id
                )?.totalAssigned
              ) /
                Number(
                  missingUsers.find(
                    (missingUser) => missingUser.eventId === event.id
                  )?.totalRequired
                )) *
              100
            }
          />
          <small className="text-sm font-medium leading-none">
            {(missingUsers.find(
              (missingUser) => missingUser.eventId === event.id
            )?.totalAssigned || 0) +
              " von " +
              (missingUsers.find(
                (missingUser) => missingUser.eventId === event.id
              )?.totalRequired || 0) +
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

export default EventsPage;
