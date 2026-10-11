import { EventForm } from "@/components/features/events/EventForm";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { getEventById } from "@/domains/events/queries";
import { requireAdminUserId } from "@/lib/auth/utils";
import { organisationBackLink } from "@/lib/edit-origin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Veranstaltung bearbeiten",
};

const EditEventPage = async (props: { params: Promise<{ eventId: string }> }) => {
  const params = await props.params;
  // Sign-in first: it waits for the request, so the queries never run while prerendering.
  const userId = await requireAdminUserId();
  const event = await getEventById(params.eventId);

  if (!event) {
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
      <EventForm userId={userId} event={event} returnTo={back.href} />
    </FormPageShell>
  );
};

export default EditEventPage;
