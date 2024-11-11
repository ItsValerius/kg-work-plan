import { auth } from "@/auth";
import db from "@/db";
import { events, shifts, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { TaskForm } from "../../new/TaskForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const EditTaskPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string; taskId: string }>;
}) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");
  const params = await props.params;
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
  });
  const shift = await db.query.shifts.findFirst({
    where: eq(shifts.id, params.shiftId),
  });
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, params.taskId),
  });
  if (!event || !shift || !task) return notFound();

  return (
    <main className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
      <Button asChild variant="outline" className="w-fit">
        <Link href={`/events/${params.eventId}`}>
          <ArrowLeft />
          Zurück
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Aufgabe bearbeiten</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            userId={session.user.id}
            eventId={params.eventId}
            shiftId={params.shiftId}
            task={task}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default EditTaskPage;
