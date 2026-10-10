import { isAdmin } from "@/lib/auth/utils";
import { EventsSection } from "@/components/features/events/EventsSection";
import { getFutureEvents, getPastEvents } from "@/domains/events/queries";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veranstaltungen",
};

const EventsPage = async () => {
  const futureEvents = await getFutureEvents();

  const userIsAdmin = await isAdmin();

  const pastEvents = userIsAdmin ? await getPastEvents() : [];

  return (
    <PageContainer>
      <div className="space-y-16 md:space-y-24">
        <EventsSection
          events={futureEvents}
          userIsAdmin={userIsAdmin}
          title="Veranstaltungen"
          description="Such dir eine Veranstaltung aus und trag dich bei einer Aufgabe ein, die noch Helfer braucht."
          emptyStateTitle="Keine Veranstaltungen geplant"
          emptyStateDescription="Aktuell sind keine bevorstehenden Veranstaltungen vorhanden."
          emptyStateActionText="Neue Veranstaltungen legst du unter „Organisation“ an."
          showAddButton={true}
          isFutureEvents={true}
        />
        {userIsAdmin && (
          <EventsSection
            events={pastEvents}
            userIsAdmin={userIsAdmin}
            title="Vergangene Veranstaltungen"
            description="Nur für Organisatoren sichtbar."
            showAddButton={false}
            isFutureEvents={false}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default EventsPage;
