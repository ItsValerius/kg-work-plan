import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EventForm } from "./EventForm";

const NewEventPage = async () => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");
  return (
    <div>
      <EventForm userId={session.user.id} event={null} />
    </div>
  );
};

export default NewEventPage;
