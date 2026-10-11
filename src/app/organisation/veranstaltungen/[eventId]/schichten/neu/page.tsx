import { ShiftForm } from "@/components/features/shifts/ShiftForm";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { getEventById } from "@/domains/events/queries";
import { requireAdminUserId } from "@/lib/auth/utils";
import { formatShortDate } from "@/lib/datetime";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Neue Schicht",
};

const NewShiftPage = async (props: { params: Promise<{ eventId: string }> }) => {
  const params = await props.params;
  // Sign-in first: it waits for the request, so the queries never run while prerendering.
  const userId = await requireAdminUserId();
  const event = await getEventById(params.eventId);
  if (!event) notFound();

  return (
    <FormPageShell
      title="Neue Schicht"
      context={`${event.name} · ${formatShortDate(event.startDate)}`}
      backHref={`/organisation?event=${event.id}&ansicht=planen`}
      backLabel="Zurück zur Planung"
    >
      <ShiftForm
        userId={userId}
        eventId={event.id}
        eventStart={event.startDate}
        eventEnd={event.endDate}
        shift={null}
      />
    </FormPageShell>
  );
};

export default NewShiftPage;
