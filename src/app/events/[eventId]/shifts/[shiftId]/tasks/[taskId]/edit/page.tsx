import { getAuthenticatedUser } from "@/lib/auth/utils";
import { getEventById } from "@/domains/events/queries";
import { getShiftById } from "@/domains/shifts/queries";
import { getTaskById } from "@/domains/tasks/queries";
import { notFound } from "next/navigation";
import { TaskForm } from "../../new/TaskForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const EditTaskPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string; taskId: string }>;
}) => {
  const params = await props.params;

  const [user, event, shift, task] = await Promise.all([
    getAuthenticatedUser(),
    getEventById(params.eventId),
    getShiftById(params.shiftId),
    getTaskById(params.taskId),
  ]);

  if (!event || !shift || !task) return notFound();

  return (
    <main id="main-content" className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
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
            userId={user.id}
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
