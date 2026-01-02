import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db";
import { events, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserForm } from "./UserForm";

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
    with: {
      shift: true,
    },
  });

  if (!event || !task) return notFound();
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex my-auto w-full items-center justify-center flex-col gap-4">
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
              taskName={task.name}
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
    </div>
  );
};

export default TaskDetailsPage;
