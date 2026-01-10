import { notFound, redirect } from "next/navigation";
import { ShiftForm } from "../../new/ShiftForm";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth/utils";
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

  const [user, event, shift, userIsAdmin] = await Promise.all([
    getAuthenticatedUser(),
    getEventById(params.eventId),
    getShiftByIdWithEvent(params.eventId, params.shiftId),
    isAdmin(),
  ]);

  if (!userIsAdmin || !event || !shift) return redirect("/");
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
            userId={user.id}
            eventId={event.id}
            shift={shift}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default EditShiftPapge;
