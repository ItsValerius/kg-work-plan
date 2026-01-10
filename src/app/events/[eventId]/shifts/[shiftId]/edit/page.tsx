import { notFound } from "next/navigation";
import { ShiftForm } from "@/components/features/shifts/ShiftForm";
import { getAuthenticatedAdminUserId, isAdmin } from "@/lib/auth/utils";
import { getEventById } from "@/domains/events/queries";
import { getShiftByIdWithEvent } from "@/domains/shifts/queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";

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
    <PageContainer variant="form">
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
    </PageContainer>
  );
};

export default EditShiftPapge;
