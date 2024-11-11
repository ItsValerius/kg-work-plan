import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EventForm } from "./EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NewEventPage = async () => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/");
  return (
    <main className="p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto">
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
          <EventForm userId={session.user.id} event={null} />
        </CardContent>
      </Card>
    </main>
  );
};

export default NewEventPage;
