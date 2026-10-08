import { EventRail, type RailEvent } from "@/components/features/dashboard/cockpit/EventRail";
import { EventPicker } from "@/components/features/dashboard/cockpit/EventPicker";
import { GapsView } from "@/components/features/dashboard/cockpit/GapsView";
import { HelperList } from "@/components/features/dashboard/cockpit/HelperList";
import { PlanView } from "@/components/features/dashboard/cockpit/PlanView";
import { DeleteEventButton } from "@/components/features/dashboard/cockpit/DeleteEventButton";
import DuplicateButton from "@/components/shared/buttons/DuplicateButton";
import { eventSpots } from "@/components/features/dashboard/cockpit/spots";
import { ParticipantsTab } from "@/components/features/dashboard/participants/ParticipantsTab";
import { DateBlock } from "@/components/features/events/DateBlock";
import { OpenSpots } from "@/components/features/events/OpenSpots";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  getEventWorkPlan,
  getFutureEvents,
  getMissingUsersPerEvents,
  getPastEvents,
} from "@/domains/events/queries";
import { isAdmin } from "@/lib/auth/utils";
import { formatShortDate } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowUpRight, Pencil, Plus, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Organisation",
};

const VIEWS = ["luecken", "helfer", "planen", "alle"] as const;
type View = (typeof VIEWS)[number];

interface DashboardPageProps {
  searchParams: Promise<{ event?: string; ansicht?: string }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  if (!(await isAdmin())) return redirect("/");

  const params = await searchParams;
  const view: View = VIEWS.includes(params.ansicht as View) ? (params.ansicht as View) : "luecken";

  const [futureEvents, pastEvents] = await Promise.all([getFutureEvents(), getPastEvents()]);
  const counts = await getMissingUsersPerEvents([...futureEvents, ...pastEvents].map((e) => e.id));
  const toRail = (event: (typeof futureEvents)[number]): RailEvent => ({
    id: event.id,
    name: event.name,
    startDate: event.startDate,
    open: counts[event.id]?.openSpotsCount ?? 0,
    required: counts[event.id]?.requiredParticipantsCount ?? 0,
  });
  const upcoming = futureEvents.map(toRail);
  const past = [...pastEvents].reverse().map(toRail);

  const selectedId =
    view === "alle"
      ? null
      : [...upcoming, ...past].some((e) => e.id === params.event)
        ? params.event!
        : (upcoming[0]?.id ?? past[0]?.id ?? null);
  const event = selectedId ? await getEventWorkPlan(selectedId) : null;
  const spots = event ? eventSpots(event) : null;
  const tabView = view === "alle" ? "luecken" : view;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <h1 className="text-[48px] md:text-[clamp(56px,5.7vw,80px)]">Organisation</h1>
        <div className="flex flex-wrap gap-2.5">
          <Button asChild variant="outline">
            <Link href="/dashboard?ansicht=alle" aria-current={view === "alle" ? "page" : undefined}>
              <Users aria-hidden="true" />
              Alle Helfer
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/events/new">
              <Plus aria-hidden="true" />
              Neue Veranstaltung
            </Link>
          </Button>
        </div>
      </div>

      {view === "alle" ? (
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-md pr-2 text-[15px] font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Zurück zu den Veranstaltungen
          </Link>
          <ParticipantsTab />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr] md:gap-10 print:mt-0 print:block">
          <EventRail upcoming={upcoming} past={past} selectedId={selectedId} view={tabView} />

          <div className="min-w-0">
            {upcoming.length + past.length > 0 && selectedId && (
              <EventPicker
                events={[...upcoming, ...past].map((e) => ({
                  id: e.id,
                  label: `${formatShortDate(e.startDate)} · ${e.name}${e.required > 0 ? ` · ${e.open > 0 ? `${e.open} frei` : "voll"}` : ""}`,
                }))}
                selectedId={selectedId}
                view={tabView}
              />
            )}

            {!event ? (
              <div className="rounded-lg bg-muted p-6 md:p-8">
                <h2 className="text-[32px]">Noch keine Veranstaltungen</h2>
                <p className="mt-2 text-[17px] text-muted-foreground">
                  Lege die erste Veranstaltung an, dann erscheinen hier ihre Lücken und die Helferliste.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/dashboard/events/new">Veranstaltung anlegen</Link>
                </Button>
              </div>
            ) : (
              <article aria-labelledby="cockpit-titel" className="mt-6 md:mt-0">
                <header className="grid gap-x-8 gap-y-3 border-b pb-6 sm:grid-cols-[auto_1fr]">
                  <DateBlock date={event.startDate} size="lg" className="print:hidden" />
                  <div className="min-w-0">
                    <h2 id="cockpit-titel" className="text-[44px] wrap-break-word md:text-[48px]">
                      {event.name}
                    </h2>
                    <p className="mt-1 hidden text-[17px] print:block">{formatShortDate(event.startDate)}</p>
                    {spots && <OpenSpots open={spots.open} required={spots.required} className="mt-2 text-[17px] print:hidden" />}
                    <div className="mt-4 flex flex-wrap gap-2.5 print:hidden">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/events/${event.id}`}>
                          <ArrowUpRight aria-hidden="true" />
                          Arbeitsplan öffnen
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/events/${event.id}/edit`}>
                          <Pencil aria-hidden="true" />
                          Bearbeiten
                        </Link>
                      </Button>
                      <DuplicateButton
                        eventId={event.id}
                        eventName={event.name}
                        eventStartDate={event.startDate}
                        eventEndDate={event.endDate}
                        className="min-h-9"
                        showText
                      />
                      <DeleteEventButton eventId={event.id} eventName={event.name} />
                    </div>
                  </div>
                </header>

                <nav aria-label="Ansicht" className="mt-6 flex gap-1 border-b print:hidden">
                  {(
                    [
                      ["luecken", `Lücken${spots && spots.open > 0 ? ` (${spots.open})` : ""}`],
                      ["helfer", "Helferliste"],
                      ["planen", "Planen"],
                    ] as const
                  ).map(([id, label]) => (
                    <Link
                      key={id}
                      href={`/dashboard?event=${event.id}&ansicht=${id}`}
                      aria-current={view === id ? "page" : undefined}
                      className={cn(
                        "relative -mb-px flex min-h-12 items-center border-b-[3px] border-transparent px-4 font-semibold text-muted-foreground transition-colors hover:text-foreground",
                        view === id && "border-primary text-primary"
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6">
                  {view === "helfer" ? (
                    <HelperList event={event} />
                  ) : view === "planen" ? (
                    <PlanView event={event} />
                  ) : (
                    <GapsView event={event} />
                  )}
                </div>
              </article>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default DashboardPage;
