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
import db from "@/db";
import { isAdmin } from "@/lib/auth/utils";
import { getMissingUsersPerEvent } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const EventsPage = async () => {
  const events = await db.query.events.findMany({});
  const missingUsers = await getMissingUsersPerEvent();
  const user = (await auth())?.user;
  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
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
            <Link href={`/events/new`}>Add Event</Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {events.map((event) => {
          return (
            <Card key={event.id}>
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
        })}
      </div>
    </main>
  );
};

export default EventsPage;
