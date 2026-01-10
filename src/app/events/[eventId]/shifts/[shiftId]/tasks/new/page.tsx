import { getAuthenticatedUser } from "@/lib/auth/utils";
import { getEventById } from "@/domains/events/queries";
import { getShiftById } from "@/domains/shifts/queries";
import { notFound, redirect } from "next/navigation";
import { TaskForm } from "./TaskForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const NewShiftPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string }>;
}) => {
  const params = await props.params;

  const [user, event, shift] = await Promise.all([
    getAuthenticatedUser(),
    getEventById(params.eventId),
    getShiftById(params.shiftId),
  ]);

  if (!event || !shift) return notFound();

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
          <CardTitle>Neue Aufgabe Erstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            userId={user.id}
            eventId={params.eventId}
            shiftId={params.shiftId}
            task={null}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default NewShiftPage;
