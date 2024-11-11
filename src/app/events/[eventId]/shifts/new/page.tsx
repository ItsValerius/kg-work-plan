import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ShiftForm } from "./ShiftForm";

const NewShiftPage = async (props: {
  params: Promise<{ eventId: string }>;
}) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");
  const params = await props.params;

  return (
    <div>
      <ShiftForm
        userId={session.user.id}
        eventId={params.eventId}
        shift={null}
      />
    </div>
  );
};

export default NewShiftPage;
