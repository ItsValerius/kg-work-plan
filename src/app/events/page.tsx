import db from "@/db";
import { events } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { getStartOfToday } from "@/lib/date-utils";
import { asc, gte, lt } from "drizzle-orm";
import { EventsSection } from "./EventsSection";

const EventsPage = async () => {
  const startOfToday = getStartOfToday();

  const futureEvents = await db.query.events.findMany({
    orderBy: [asc(events.startDate)],
    where: gte(events.endDate, startOfToday),
  });

  const userIsAdmin = await isAdmin();

  const pastEvents = userIsAdmin
    ? await db.query.events.findMany({
      orderBy: [asc(events.startDate)],
      where: lt(events.endDate, startOfToday),
    })
    : [];

  return (
    <main id="main-content" className="container mx-auto py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8 max-w-7xl">
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
    </main>
  );
};


export default EventsPage;
