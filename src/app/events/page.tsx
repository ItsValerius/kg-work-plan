import { isAdmin } from "@/lib/auth/utils";
import { EventsSection } from "@/components/features/events/EventsSection";
import { getFutureEvents, getPastEvents } from "@/domains/events/queries";
import { PageContainer } from "@/components/layout/PageContainer";

const EventsPage = async () => {
  const futureEvents = await getFutureEvents();

  const userIsAdmin = await isAdmin();

  const pastEvents = userIsAdmin ? await getPastEvents() : [];

  return (
    <PageContainer>
      <div className="space-y-12 md:space-y-16 lg:space-y-20">
        <EventsSection
          events={futureEvents}
          userIsAdmin={userIsAdmin}
          title="Bevorstehende Veranstaltungen"
          description="Hier findest du alle bevorstehenden Veranstaltungen"
          emptyStateTitle="Keine Veranstaltungen geplant"
          emptyStateDescription="Aktuell sind keine bevorstehenden Veranstaltungen vorhanden."
          emptyStateActionText="Füge jetzt eine neue Veranstaltung hinzu."
          showAddButton={true}
          isFutureEvents={true}
        />
        {userIsAdmin && (
          <EventsSection
            events={pastEvents}
            userIsAdmin={userIsAdmin}
            title="Vergangene Veranstaltungen"
            description="Hier findest du alle vergangenen Veranstaltungen"
            showAddButton={false}
            isFutureEvents={false}
          />
        )}
      </div>
    </PageContainer>
  );
};


export default EventsPage;
