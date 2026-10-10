import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { EventsSectionProps } from "@/domains/events/types";
import Link from "next/link";
import { Suspense } from "react";
import { EventsList } from "./EventsList";
import { EventsListSkeleton } from "@/components/layout/Skeletons";

export const EventsSection = ({
  title,
  description,
  isFutureEvents,
  ...rest
}: EventsSectionProps) => {
  return (
    <section aria-labelledby={isFutureEvents ? "events-heading" : "past-events-heading"}>
      <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {isFutureEvents ? (
            <h1 id="events-heading" className="text-[48px] md:text-[clamp(56px,5.7vw,80px)]">
              {title}
            </h1>
          ) : (
            <h2 id="past-events-heading" className="text-[34px] md:text-[44px]">
              {title}
            </h2>
          )}
          <p className="mt-3 max-w-[60ch] text-[17px] text-muted-foreground">{description}</p>
        </div>
      </div>

      <Suspense fallback={<EventsListSkeleton />}>
        <EventsSectionBody isFutureEvents={isFutureEvents} {...rest} />
      </Suspense>
    </section>
  );
};

/** The list (or empty state) below the heading; waits for the events and the admin check. */
async function EventsSectionBody({
  events,
  userIsAdmin: userIsAdminPromise,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateActionText,
  showAddButton,
  isFutureEvents,
}: Omit<EventsSectionProps, "title" | "description">) {
  const [eventsList, userIsAdmin] = await Promise.all([events, userIsAdminPromise]);
  const canShowAddButton = showAddButton && userIsAdmin;

  return eventsList.length === 0 ? (
    <div className="rounded-xl border bg-muted px-6 py-10 md:px-10">
      {emptyStateTitle && <h2 className="text-[32px]">{emptyStateTitle}</h2>}
      {emptyStateDescription && (
        <p className="mt-2 text-[17px] text-muted-foreground">{emptyStateDescription}</p>
      )}
      {userIsAdmin && emptyStateActionText && (
        <p className="mt-1 text-[17px] text-muted-foreground">{emptyStateActionText}</p>
      )}
      {canShowAddButton && (
        <Link href="/organisation/veranstaltungen/neu" className={cn(buttonVariants(), "mt-6")}>
          In der Organisation anlegen
        </Link>
      )}
    </div>
  ) : (
    <EventsList events={eventsList} isPast={!isFutureEvents} />
  );
}
