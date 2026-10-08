import { EventForm } from "@/components/features/events/EventForm";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { requireAdminUserId } from "@/lib/auth/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neue Veranstaltung",
};

const NewEventPage = async () => {
  const userId = await requireAdminUserId();
  return (
    <FormPageShell
      title="Neue Veranstaltung"
      backHref="/dashboard"
      backLabel="Zurück zur Organisation"
    >
      <EventForm userId={userId} event={null} />
    </FormPageShell>
  );
};

export default NewEventPage;
