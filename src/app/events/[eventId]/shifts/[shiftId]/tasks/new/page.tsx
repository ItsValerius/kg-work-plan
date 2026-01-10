import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { getEventById } from "@/domains/events/queries";
import { getShiftById } from "@/domains/shifts/queries";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/features/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

const NewShiftPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string }>;
}) => {
  const params = await props.params;

  const [userId, event, shift] = await Promise.all([
    getAuthenticatedAdminUserId(),
    getEventById(params.eventId),
    getShiftById(params.shiftId),
  ]);

  if (!event || !shift) return notFound();

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
          <CardTitle>Neue Aufgabe Erstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            userId={userId}
            eventId={params.eventId}
            shiftId={params.shiftId}
            task={null}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default NewShiftPage;
