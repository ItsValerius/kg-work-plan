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
  const [userId, event] = await Promise.all([requireAdminUserId(), getEventById(params.eventId)]);
  if (!event) notFound();

  return (
    <FormPageShell
      title="Neue Schicht"
      context={`${event.name} · ${formatShortDate(event.startDate)}`}
      backHref={`/dashboard?event=${event.id}&ansicht=planen`}
      backLabel="Zurück zur Planung"
    >
      <ShiftForm userId={userId} eventId={event.id} shift={null} />
    </FormPageShell>
  );
};

export default NewShiftPage;
