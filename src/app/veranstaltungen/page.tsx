import { isAdmin } from "@/lib/auth/utils";
import { EventsSection } from "@/components/features/events/EventsSection";
import { getFutureEvents, getPastEvents } from "@/domains/events/queries";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Veranstaltungen",
};

const EventsPage = () => {
  return (
    <PageContainer>
      <div className="space-y-16 md:space-y-24">
        <EventsSection
          events={getFutureEvents()}
          userIsAdmin={isAdmin()}
          title="Veranstaltungen"
          description="Such dir eine Veranstaltung aus und trag dich bei einer Aufgabe ein, die noch Helfer braucht."
          emptyStateTitle="Keine Veranstaltungen geplant"
          emptyStateDescription="Aktuell sind keine bevorstehenden Veranstaltungen vorhanden."
          emptyStateActionText="Neue Veranstaltungen legst du unter „Organisation“ an."
          showAddButton={true}
          isFutureEvents={true}
        />
        <Suspense>
          <PastEventsSection />
        </Suspense>
      </div>
    </PageContainer>
  );
};

/** Past events, only for organizers and only when there are any. */
async function PastEventsSection() {
  if (!(await isAdmin())) return null;
  const pastEvents = await getPastEvents();
  if (pastEvents.length === 0) return null;

  return (
    <EventsSection
      events={Promise.resolve(pastEvents)}
      userIsAdmin={Promise.resolve(true)}
      title="Vergangene Veranstaltungen"
      description="Nur für Organisatoren sichtbar."
      showAddButton={false}
      isFutureEvents={false}
    />
  );
}

export default EventsPage;
