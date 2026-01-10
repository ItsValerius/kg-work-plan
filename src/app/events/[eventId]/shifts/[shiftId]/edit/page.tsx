import { notFound } from "next/navigation";
import { ShiftForm } from "@/components/features/shifts/ShiftForm";
import { getAuthenticatedAdminUserId, isAdmin } from "@/lib/auth/utils";
import { getEventById } from "@/domains/events/queries";
import { getShiftByIdWithEvent } from "@/domains/shifts/queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const EditShiftPapge = async (props: {
  params: Promise<{ eventId: string; shiftId: string }>;
}) => {
  const params = await props.params;

  const [event, shift, userIsAdmin] = await Promise.all([
    getEventById(params.eventId),
    getShiftByIdWithEvent(params.eventId, params.shiftId),
    isAdmin(),
  ]);

  if (!userIsAdmin || !event || !shift) {
    notFound();
  }

  // At this point we know user is admin, so we can safely get the admin user ID
  const userId = await getAuthenticatedAdminUserId();
  return (
    <main id="main-content" className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
      <Button asChild variant="outline" className="w-fit">
        <Link href={`/events/${event.id}`}>
          <ArrowLeft />
          Zurück
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Schicht bearbeiten</CardTitle>
        </CardHeader>
        <CardContent>
          <ShiftForm
            userId={userId}
            eventId={event.id}
            shift={shift}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default EditShiftPapge;
