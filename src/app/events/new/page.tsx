import React from "react";
import { EventForm } from "./EventForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const NewEventPage = async () => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");
  return (
    <div>
      <EventForm userId={session.user.id} />
    </div>
  );
};

export default NewEventPage;
