import React from "react";
import { UserForm } from "./UserForm";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import db from "@/db";
import { eq } from "drizzle-orm";
import { events, tasks } from "@/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const TaskDetailsPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string; taskId: string }>;
}) => {
  const session = await auth();
  const params = await props.params;
  if (!session?.user?.id) {
    const callbackUrl = `/events/${params.eventId}/shifts/${params.shiftId}/tasks/${params.taskId}`;
    return redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
  });
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, params.taskId),
  });
  if (!event || !task) return notFound();
  return (
    <div className="flex h-screen w-full items-center justify-center px-4 flex-col gap-4">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>
            Aufgaben Anmeldung -{" "}
            <span className="underline decoration-primary">{task.name}</span>
          </CardTitle>
          <CardDescription>
            Du musst die Felder unten nur Ausfüllen, falls du dich als Gruppe
            eintragen möchtest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            shiftId={params.shiftId}
            taskId={params.taskId}
            userId={session.user.id}
            eventId={params.eventId}
          />
        </CardContent>
      </Card>
      <Button asChild variant={"outline"}>
        <Link href={`/events/${params.eventId}`}>
          <ArrowLeft />
          Zurück
        </Link>
      </Button>
    </div>
  );
};

export default TaskDetailsPage;
