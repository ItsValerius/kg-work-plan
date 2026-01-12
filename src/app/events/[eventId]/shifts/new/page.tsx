import { getAuthenticatedAdminUserId } from "@/lib/auth/utils";
import { ShiftForm } from "@/components/features/shifts/ShiftForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neue Schicht Erstellen",
};

const NewShiftPage = async (props: {
  params: Promise<{ eventId: string }>;
}) => {
  const params = await props.params;
  const userId = await getAuthenticatedAdminUserId();

  return (
    <PageContainer variant="form">
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
            userId={userId}
            eventId={params.eventId}
            shift={null}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default NewShiftPage;
