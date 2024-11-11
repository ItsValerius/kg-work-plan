import { notFound, redirect } from "next/navigation";
import { ShiftForm } from "../../new/ShiftForm";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/utils";
import db from "@/db";
import { events, shifts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const EditShiftPapge = async (props: {
  params: Promise<{ eventId: string; shiftId: string }>;
}) => {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user)) return redirect("/");
  const params = await props.params;
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
    with: {
      shifts: {
        where: eq(shifts.id, params.shiftId),
      },
    },
  });
  if (!event || !event.shifts[0]) return notFound();
  return (
    <main className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
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
            userId={session.user.id}
            eventId={event.id}
            shift={event.shifts[0]}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default EditShiftPapge;
