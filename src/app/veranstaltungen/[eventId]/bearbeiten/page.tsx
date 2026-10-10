import { EventForm } from "@/components/features/events/EventForm";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { getEventById } from "@/domains/events/queries";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth/utils";
import { organisationBackLink } from "@/lib/edit-origin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata(props: EditEventPageProps): Promise<Metadata> {
  const params = await props.params;
  const event = await getEventById(params.eventId);
  return { title: event ? `${event.name} bearbeiten` : "Veranstaltung bearbeiten" };
}

const EditEventPage = async (props: EditEventPageProps) => {
  const params = await props.params;
  const [user, event, userIsAdmin] = await Promise.all([
    getAuthenticatedUser(),
    getEventById(params.eventId),
    isAdmin(),
  ]);

  if (!event || !userIsAdmin) {
    notFound();
  }

  const back = organisationBackLink(event.id, "luecken");
  return (
    <FormPageShell
      title="Veranstaltung bearbeiten"
      context={event.name}
      backHref={back.href}
      backLabel={back.label}
    >
      <EventForm userId={user.id} event={event} returnTo={back.href} />
    </FormPageShell>
  );
};

export default EditEventPage;
