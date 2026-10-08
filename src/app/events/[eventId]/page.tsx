import { DateBlock } from "@/components/features/events/DateBlock";
import { eventSpots, sumSpots } from "@/domains/tasks/spots";
import { OpenSpots } from "@/components/features/events/OpenSpots";
import { TaskSheet } from "@/components/features/worksheet/TaskSheet";
import { PageContainer } from "@/components/layout/PageContainer";
import { getEventWorkPlan } from "@/domains/events/queries";
import { formatShortDate, formatTime, isSameBerlinDay } from "@/lib/datetime";
import { getSession } from "@/lib/auth/utils";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ eingetragen?: string }>;
}

export async function generateMetadata(props: EventPageProps): Promise<Metadata> {
  const params = await props.params;
  const event = await getEventWorkPlan(params.eventId);
  return { title: event ? event.name : "Veranstaltung nicht gefunden" };
}

export default async function EventPage(props: EventPageProps) {
  const [params, searchParams, session] = await Promise.all([
    props.params,
    props.searchParams,
    getSession(),
  ]);
  const event = await getEventWorkPlan(params.eventId);

  if (!event) {
    notFound();
  }

  const viewerId = session?.user?.id ?? null;
  const spots = eventSpots(event);
  const multiDay = !isSameBerlinDay(event.startDate, event.endDate);

  return (
    <PageContainer>
      <Link
        href="/events"
        className="inline-flex min-h-11 items-center gap-2 rounded-md pr-2 text-[15px] font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Alle Veranstaltungen
      </Link>

      <header className="mt-3 grid gap-x-10 gap-y-4 border-b pb-6 md:mt-8 md:grid-cols-[auto_1fr] md:items-start md:pb-10">
        <DateBlock date={event.startDate} size="lg" className="hidden md:flex" />
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3 md:hidden">
            <DateBlock date={event.startDate} />
            {!multiDay && (
              <span className="tabular font-display text-[26px] leading-none font-bold text-muted-foreground">
                {formatTime(event.startDate)} – {formatTime(event.endDate)}
              </span>
            )}
          </div>
          <h1 className="text-[44px] wrap-break-word md:text-[clamp(56px,5.7vw,80px)]">
            {event.name}
          </h1>
          <p
            className={
              multiDay
                ? "mt-2 text-[17px] text-muted-foreground md:mt-3"
                : "mt-3 hidden text-[17px] text-muted-foreground md:block"
            }
          >
            {multiDay
              ? `${formatShortDate(event.startDate)} bis ${formatShortDate(event.endDate)}`
              : `${formatShortDate(event.startDate)}, ${formatTime(event.startDate)} – ${formatTime(event.endDate)} Uhr`}
          </p>
          {event.description && (
            <p className="mt-2 max-w-[65ch] text-[17px] leading-relaxed wrap-break-word md:mt-3">
              {event.description}
            </p>
          )}
          <OpenSpots
            open={spots.open}
            required={spots.required}
            className="mt-3 text-[19px] md:mt-5"
          />
        </div>
      </header>

      {event.shifts.length === 0 && (
        <p className="mt-10 text-[17px] text-muted-foreground">
          Für diese Veranstaltung sind noch keine Schichten geplant.
        </p>
      )}

      <div className="mt-1 md:mt-6">
        {event.shifts.map((shift) => {
          const shiftSpots = sumSpots(shift.tasks);
          return (
            <section
              key={shift.id}
              aria-labelledby={`schicht-${shift.id}`}
              className="grid gap-x-10 gap-y-4 pt-5 pb-8 md:grid-cols-[264px_1fr] md:py-10"
            >
              <div className="rounded-lg bg-muted px-4 py-4 md:sticky md:top-24 md:self-start md:px-5 md:py-6">
                <p className="tabular font-display text-[34px] leading-none font-bold whitespace-nowrap text-primary md:text-[36px]">
                  {formatTime(shift.startTime)}
                  <span className="text-muted-foreground"> – {formatTime(shift.endTime)}</span>
                </p>
                <h2 id={`schicht-${shift.id}`} className="mt-2 text-[30px] md:text-[34px]">
                  {shift.name}
                </h2>
                {multiDay && (
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    {formatShortDate(shift.startTime)}
                  </p>
                )}
                {shiftSpots.required > 0 && (
                  <p
                    className={
                      shiftSpots.open > 0
                        ? "mt-2 text-[15px] font-semibold text-primary"
                        : "mt-2 text-[15px] text-muted-foreground"
                    }
                  >
                    {shiftSpots.open > 0
                      ? `${shiftSpots.open} ${shiftSpots.open === 1 ? "Platz" : "Plätze"} frei`
                      : "Alles belegt"}
                  </p>
                )}
              </div>

              <div className="grid gap-5 md:gap-6">
                {shift.tasks.map((task) => (
                  <TaskSheet
                    key={task.id}
                    eventId={event.id}
                    shiftId={shift.id}
                    task={task}
                    viewerId={viewerId}
                    justClaimed={searchParams.eingetragen === task.id}
                  />
                ))}
                {shift.tasks.length === 0 && (
                  <p className="text-[17px] text-muted-foreground">
                    In dieser Schicht gibt es noch keine Aufgaben.
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}
