import { getAuthenticatedUser } from "@/lib/auth/utils";
import { ShiftForm } from "./ShiftForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const NewShiftPage = async (props: {
  params: Promise<{ eventId: string }>;
}) => {
  const params = await props.params;
  const user = await getAuthenticatedUser();

  return (
    <main id="main-content" className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
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
            userId={user.id}
            eventId={params.eventId}
            shift={null}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default NewShiftPage;
