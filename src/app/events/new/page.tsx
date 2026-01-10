import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { EventForm } from "@/components/features/events/EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NewEventPage = async () => {
  const userId = await getAuthenticatedAdminUserId();
  return (
    <main id="main-content" className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
      <Button asChild variant="outline" className="w-fit">
        <Link href="/events">
          {" "}
          <ArrowLeft />
          Zurück
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Neue Veranstaltung Erstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm userId={userId} event={null} />
        </CardContent>
      </Card>
    </main>
  );
};

export default NewEventPage;
