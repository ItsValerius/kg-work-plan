import { auth } from "@/auth";
import db from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EventForm } from "../../new/EventForm";
import { isAdmin } from "@/lib/auth/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  if (!event || !user?.id || !(await isAdmin())) {
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
