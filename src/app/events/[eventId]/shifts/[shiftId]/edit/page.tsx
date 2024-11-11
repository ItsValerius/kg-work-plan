import { notFound, redirect } from "next/navigation";
import { ShiftForm } from "../../new/ShiftForm";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/utils";
import db from "@/db";
import { events, shifts } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    <ShiftForm
      userId={session.user.id}
      eventId={event.id}
      shift={event.shifts[0]}
    />
  );
};

export default EditShiftPapge;
