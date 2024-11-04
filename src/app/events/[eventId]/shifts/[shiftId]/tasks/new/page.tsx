import React from "react";
import { TaskForm } from "./TaskForm";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { events } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";

const NewShiftPage = async (props: {
  params: Promise<{ eventId: string; shiftId: string }>;
}) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");
  const params = await props.params;
  const event = await db.query.events.findFirst({
    where: eq(events.id, params.eventId),
  });
  if (!event) return notFound();

  return (
    <div>
      <TaskForm
        userId={session.user.id}
        eventId={params.eventId}
        shiftId={params.shiftId}
      />
    </div>
  );
};

export default NewShiftPage;