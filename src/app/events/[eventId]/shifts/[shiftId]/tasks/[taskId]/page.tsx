import { getSession } from "@/lib/auth/utils";
import { getEventById } from "@/domains/events/queries";
import { getTaskByIdWithShift } from "@/domains/tasks/queries";
import { getParticipantByUserAndTask } from "@/domains/participants/queries";
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
import { UserForm } from "@/components/features/participants/UserForm";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";

interface TaskDetailsPageProps {
  params: Promise<{ eventId: string; shiftId: string; taskId: string }>;
}

export async function generateMetadata(
  props: TaskDetailsPageProps
): Promise<Metadata> {
  const params = await props.params;
  const task = await getTaskByIdWithShift(params.taskId);

  if (!task) {
    return {
      title: "Aufgabe",
    };
  }

  return {
    title: `Aufgaben Anmeldung - ${task.name}`,
  };
}

const TaskDetailsPage = async (props: TaskDetailsPageProps) => {
  const params = await props.params;
  const session = await getSession();

  if (!session?.user?.id) {
    const callbackUrl = `/events/${params.eventId}/shifts/${params.shiftId}/tasks/${params.taskId}`;
    return redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const [event, task, existingParticipant] = await Promise.all([
    getEventById(params.eventId),
    getTaskByIdWithShift(params.taskId),
    getParticipantByUserAndTask(session.user.id, params.taskId),
  ]);

  if (!event || !task) return notFound();
  return (
    <PageContainer variant="wide">
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
              taskId={params.taskId}
              userId={session.user.id}
              taskName={task.name}
              existingParticipant={existingParticipant}
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
    </PageContainer>
  );
};

export default TaskDetailsPage;
