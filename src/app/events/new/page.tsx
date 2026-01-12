import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { EventForm } from "@/components/features/events/EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neue Veranstaltung Erstellen",
};

const NewEventPage = async () => {
  const userId = await getAuthenticatedAdminUserId();
  return (
    <PageContainer variant="form">
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
    </PageContainer>
  );
};

export default NewEventPage;
