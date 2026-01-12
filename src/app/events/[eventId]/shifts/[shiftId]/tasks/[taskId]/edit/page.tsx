import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { getEventById } from "@/domains/events/queries";
import { getShiftById } from "@/domains/shifts/queries";
import { getTaskById } from "@/domains/tasks/queries";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/features/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aufgabe bearbeiten",
};

const EditTaskPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string; taskId: string }>;
}) => {
  const params = await props.params;

  const [userId, event, shift, task] = await Promise.all([
    getAuthenticatedAdminUserId(),
    getEventById(params.eventId),
    getShiftById(params.shiftId),
    getTaskById(params.taskId),
  ]);

  if (!event || !shift || !task) return notFound();

  return (
    <PageContainer variant="form">
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
            userId={userId}
            eventId={params.eventId}
            shiftId={params.shiftId}
            task={task}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default EditTaskPage;
