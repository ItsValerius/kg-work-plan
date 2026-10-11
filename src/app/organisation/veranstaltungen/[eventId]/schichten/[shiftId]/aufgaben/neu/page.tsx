import { TaskForm } from "@/components/features/tasks/TaskForm";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { getEventById } from "@/domains/events/queries";
import { getShiftById } from "@/domains/shifts/queries";
import { requireAdminUserId } from "@/lib/auth/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Neue Aufgabe",
};

const NewTaskPage = async (props: { params: Promise<{ eventId: string; shiftId: string }> }) => {
  const params = await props.params;
  // Sign-in first: it waits for the request, so the queries never run while prerendering.
  const userId = await requireAdminUserId();
  const [event, shift] = await Promise.all([
    getEventById(params.eventId),
    getShiftById(params.shiftId),
  ]);
  if (!event || !shift) notFound();

  return (
    <FormPageShell
      title="Neue Aufgabe"
      context={`${event.name} · Schicht ${shift.name}`}
      backHref={`/organisation?event=${event.id}&ansicht=planen`}
      backLabel="Zurück zur Planung"
    >
      <TaskForm
        userId={userId}
        eventId={event.id}
        shiftId={shift.id}
        shiftStart={shift.startTime}
        task={null}
      />
    </FormPageShell>
  );
};

export default NewTaskPage;
