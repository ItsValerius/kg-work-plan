import db from "@/db";
import { events } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { getStartOfToday } from "@/lib/date-utils";
import { asc, gte, lt } from "drizzle-orm";
import { Suspense } from "react";
import { EventsSection } from "./EventsSection";
import { EventsSectionSkeleton } from "./EventsSectionSkeleton";

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
    <main className="container mx-auto py-8">
      <Suspense
        fallback={
          <EventsSectionSkeleton
            title="Bevorstehende Veranstaltungen"
            description="Hier findest du alle bevorstehenden Veranstaltungen"
            showAddButton={userIsAdmin}
            isFutureEvents={true}
          />
        }
      >
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
      </Suspense>
      {userIsAdmin && (
        <Suspense
          fallback={
            <EventsSectionSkeleton
              title="Vergangene Veranstaltungen"
              description="Hier findest du alle vergangenen Veranstaltungen"
              showAddButton={false}
              isFutureEvents={false}
            />
          }
        >
          <EventsSection
            events={pastEvents}
            userIsAdmin={userIsAdmin}
            title="Vergangene Veranstaltungen"
            description="Hier findest du alle vergangenen Veranstaltungen"
            showAddButton={false}
            isFutureEvents={false}
          />
        </Suspense>
      )}
    </main>
  );
};


export default EventsPage;
