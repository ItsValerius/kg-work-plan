// app/events/[eventId]/page.tsx
import db from "@/db/index";
import { events, shifts, tasks, taskParticipants } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
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

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{event.name}</h1>
        <Link
          href={`/events/${event.id}/shifts/new`}
          className="btn btn-primary"
        >
          Add Shift
        </Link>
      </div>

      <div className="space-y-6">
        {event.shifts.map((shift) => (
          <div key={shift.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{shift.name}</h2>
              <Link
                href={`/events/${event.id}/shifts/${shift.id}/tasks/new`}
                className="btn btn-secondary"
              >
                Add Task
              </Link>
            </div>

            <div className="grid gap-4">
              {shift.tasks.map((task) => (
                <Suspense key={task.id} fallback={<div>Loading task...</div>}>
                  <TaskCard eventId={event.id} shiftId={shift.id} task={task} />
                </Suspense>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function TaskCard({
  eventId,
  shiftId,
  task,
}: {
  eventId: string;
  shiftId: string;
  task: typeof tasks.$inferSelect;
}) {
  const participants = await db.query.taskParticipants.findMany({
    where: eq(taskParticipants.taskId, task.id),
    with: {
      user: true,
    },
  });

  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{task.name}</h3>
        <span className="text-sm text-gray-500">
          {participants.length}/{task.requiredParticipants} participants
        </span>
      </div>

      <div className="mt-2">
        {participants.map((participant) => (
          <div key={participant.id} className="text-sm">
            {participant.user?.name || participant.groupName}(
            {participant.groupSize})
          </div>
        ))}
      </div>

      <Link
        href={`/events/${eventId}/shifts/${shiftId}/tasks/${task.id}`}
        className="btn btn-sm mt-2"
      >
        View Details
      </Link>
    </div>
  );
}
