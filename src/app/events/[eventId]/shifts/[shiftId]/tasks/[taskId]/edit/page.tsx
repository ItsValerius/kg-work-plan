import { TaskForm } from "@/components/features/tasks/TaskForm";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { getEventById } from "@/domains/events/queries";
import { getShiftById } from "@/domains/shifts/queries";
import { getTaskById } from "@/domains/tasks/queries";
import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { organisationBackLink } from "@/lib/edit-origin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Aufgabe bearbeiten",
};

const EditTaskPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string; taskId: string }>;
}) => {
  const params = await props.params;
  const [userId, event, shift, task] = await Promise.all([
    getAuthenticatedAdminUserId(),
    getEventById(params.eventId),
    getShiftById(params.shiftId),
    getTaskById(params.taskId),
  ]);

  if (!event || !shift || !task) notFound();

  const back = organisationBackLink(event.id, "planen");
  return (
    <FormPageShell
      title="Aufgabe bearbeiten"
      context={`${event.name} · Schicht ${shift.name}`}
      backHref={back.href}
      backLabel={back.label}
    >
      <TaskForm
        userId={userId}
        eventId={event.id}
        shiftId={shift.id}
        task={task}
        returnTo={back.href}
      />
    </FormPageShell>
  );
};

export default EditTaskPage;
