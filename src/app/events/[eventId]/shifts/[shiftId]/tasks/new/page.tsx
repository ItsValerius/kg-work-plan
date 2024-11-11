import { auth } from "@/auth";
import db from "@/db";
import { events, shifts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { TaskForm } from "./TaskForm";

const NewShiftPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string }>;
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
  if (!event || !shift) return notFound();

  return (
    <div>
      <TaskForm
        userId={session.user.id}
        eventId={params.eventId}
        shiftId={params.shiftId}
        task={null}
      />
    </div>
  );
};

export default NewShiftPage;
