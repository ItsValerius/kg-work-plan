import { auth } from "@/auth";
import db from "@/db";
import { events, shifts, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { TaskForm } from "../../new/TaskForm";

const EditTaskPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string; taskId: string }>;
}) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");
  const params = await props.params;
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
  });
  const shift = await db.query.shifts.findFirst({
    where: eq(shifts.id, params.shiftId),
  });
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, params.taskId),
  });
  if (!event || !shift || !task) return notFound();

  return (
    <div>
      <TaskForm
        userId={session.user.id}
        eventId={params.eventId}
        shiftId={params.shiftId}
        task={task}
      />
    </div>
  );
};

export default EditTaskPage;
