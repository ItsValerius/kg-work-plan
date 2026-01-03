import { Suspense } from "react";
import { getEventStatistics } from "../shared/data/getDashboardData";
import { EventsContent } from "./EventsContent";
import { Skeleton } from "@/components/ui/skeleton";

async function EventsContentWrapper() {
  const { eventStats } = await getEventStatistics();

  return <EventsContent eventStats={eventStats} />;
}

function EventsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full max-w-2xl" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
}

export function EventsTab() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <EventsContentWrapper />
    </Suspense>
  );
}

