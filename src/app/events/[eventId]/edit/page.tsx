import { notFound } from "next/navigation";
import { EventForm } from "@/components/features/events/EventForm";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getEventByIdWithShiftsAndTasks } from "@/domains/events/queries";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata(
  props: EditEventPageProps
): Promise<Metadata> {
  const params = await props.params;
  const event = await getEventByIdWithShiftsAndTasks(params.eventId);

  if (!event) {
    return {
      title: "Veranstaltung bearbeiten",
    };
  }

  return {
    title: `${event.name} bearbeiten`,
  };
}

const EditEventPage = async (props: EditEventPageProps) => {
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
    <PageContainer variant="form">
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
    </PageContainer>
  );
};

export default EditEventPage;
