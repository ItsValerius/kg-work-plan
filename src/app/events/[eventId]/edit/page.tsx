import { notFound } from "next/navigation";
import { EventForm } from "../../new/EventForm";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getEventByIdWithShiftsAndTasks } from "@/domains/events/queries";

const EditEventPage = async (props: {
  params: Promise<{ eventId: string }>;
}) => {
  const params = await props.params;

  const [user, event, userIsAdmin] = await Promise.all([
    getAuthenticatedUser(),
    getEventByIdWithShiftsAndTasks(params.eventId),
    isAdmin(),
  ]);

  if (!event || !userIsAdmin) {
    notFound();
  }
  return (
    <main id="main-content" className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
      <Button asChild variant="outline" className="w-fit">
        <Link href="/events">
          {" "}
          <ArrowLeft />
          Zurück
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Veranstaltung Bearbeiten</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm userId={user.id} event={event} />
        </CardContent>
      </Card>
    </main>
  );
};

export default EditEventPage;
