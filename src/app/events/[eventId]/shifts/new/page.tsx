import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ShiftForm } from "./ShiftForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const NewShiftPage = async (props: {
  params: Promise<{ eventId: string }>;
}) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");
  const params = await props.params;

  return (
    <main className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
      <Button asChild variant="outline" className="w-fit">
        <Link href={`/events/${params.eventId}`}>
          <ArrowLeft />
          Zurück
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Neue Schicht Erstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <ShiftForm
            userId={session.user.id}
            eventId={params.eventId}
            shift={null}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default NewShiftPage;
