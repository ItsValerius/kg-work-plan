import { auth } from "@/auth";
import db from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EventForm } from "../../new/EventForm";
import { isAdmin } from "@/lib/auth/utils";

const EditEventPage = async (props: {
  params: Promise<{ eventId: string }>;
}) => {
  const user = (await auth())?.user;
  const params = await props.params;
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
    with: {
      shifts: {
        with: {
          tasks: true,
        },
      },
    },
  });

  if (!event || !user?.id || !isAdmin(user)) {
    notFound();
  }
  return <EventForm userId={user.id} event={event} />;
};

export default EditEventPage;
