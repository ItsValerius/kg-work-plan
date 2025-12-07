import db from "@/db";
import { events } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { asc, gte, lt } from "drizzle-orm";
import { UTCDate } from "@date-fns/utc";
import { EventsSection } from "./EventsSection";

const EventsPage = async () => {
  const startOfToday = new UTCDate();
  startOfToday.setHours(-1, 0, 0, 0);

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
    <main className="container mx-auto py-8 ">
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
    </main>
  );
};


export default EventsPage;
