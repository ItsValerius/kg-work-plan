import { ShiftForm } from "@/components/features/shifts/ShiftForm";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { getEventById } from "@/domains/events/queries";
import { getShiftByIdWithEvent } from "@/domains/shifts/queries";
import { requireAdminUserId } from "@/lib/auth/utils";
import { organisationBackLink } from "@/lib/edit-origin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Schicht bearbeiten",
};

const EditShiftPage = async (props: { params: Promise<{ eventId: string; shiftId: string }> }) => {
  const params = await props.params;
  const [event, shift, userId] = await Promise.all([
    getEventById(params.eventId),
    getShiftByIdWithEvent(params.eventId, params.shiftId),
    requireAdminUserId(),
  ]);

  if (!event || !shift) {
    notFound();
  }

  const back = organisationBackLink(event.id, "planen");
  return (
    <FormPageShell
      title="Schicht bearbeiten"
      context={`${event.name} · ${shift.name}`}
      backHref={back.href}
      backLabel={back.label}
    >
      <ShiftForm
        userId={userId}
        eventId={event.id}
        eventStart={event.startDate}
        eventEnd={event.endDate}
        shift={shift}
        returnTo={back.href}
      />
    </FormPageShell>
  );
};

export default EditShiftPage;
