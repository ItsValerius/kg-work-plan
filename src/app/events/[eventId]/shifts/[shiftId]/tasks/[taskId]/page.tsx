import { getSession } from "@/lib/auth/utils";
import { getEventById } from "@/domains/events/queries";
import { getTaskByIdWithShift } from "@/domains/tasks/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserForm } from "./UserForm";

const TaskDetailsPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string; taskId: string }>;
}) => {
  const params = await props.params;
  const session = await getSession();

  if (!session?.user?.id) {
    const callbackUrl = `/events/${params.eventId}/shifts/${params.shiftId}/tasks/${params.taskId}`;
    return redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const [event, task] = await Promise.all([
    getEventById(params.eventId),
    getTaskByIdWithShift(params.taskId),
  ]);

  if (!event || !task) return notFound();
  return (
    <main id="main-content" className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex my-auto w-full items-center justify-center flex-col gap-4">
        <Card className="w-full max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>
              <h1>
                Aufgaben Anmeldung -{" "}
                <span className="underline decoration-primary">{task.name}</span>
              </h1>
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
    </main>
  );
};

export default TaskDetailsPage;
