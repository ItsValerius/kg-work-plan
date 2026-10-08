import { DateBlock } from "@/components/features/events/DateBlock";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface RailEvent {
  id: string;
  name: string;
  startDate: Date;
  open: number;
  required: number;
}

function RailItem({ event, selected, view, past }: { event: RailEvent; selected: boolean; view: string; past?: boolean }) {
  return (
    <li>
      <Link
        href={`/dashboard?event=${event.id}&ansicht=${view}`}
        aria-current={selected ? "page" : undefined}
        className={cn(
          "grid grid-cols-[64px_1fr] items-center gap-3 rounded-md border border-transparent py-3 pl-2 pr-3 transition-colors hover:bg-background",
          selected && "border-border bg-background"
        )}
      >
        <DateBlock date={event.startDate} muted={past} className="[&>span:first-child]:text-[32px]" />
        <span className="min-w-0">
          <span className={cn("block truncate font-semibold", past && "text-muted-foreground")}>{event.name}</span>
          {!past && (
            <span className={cn("block text-sm", event.open > 0 ? "font-semibold text-primary" : "text-muted-foreground")}>
              {event.required === 0 ? "noch keine Aufgaben" : event.open > 0 ? `noch ${event.open} frei` : "voll besetzt"}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

export function EventRail({
  upcoming,
  past,
  selectedId,
  view,
}: {
  upcoming: RailEvent[];
  past: RailEvent[];
  selectedId: string | null;
  view: string;
}) {
  return (
    <nav aria-label="Veranstaltungen" className="hidden rounded-lg bg-muted p-2 md:block md:sticky md:top-24 md:self-start print:hidden">
      <h2 className="px-2 pb-2 pt-2 font-sans text-[12px] font-semibold tracking-normal text-muted-foreground">
        Kommende Veranstaltungen
      </h2>
      {upcoming.length === 0 && <p className="px-2 pb-3 text-[15px] text-muted-foreground">Keine geplant.</p>}
      <ul className="grid gap-0.5">
        {upcoming.map((event) => (
          <RailItem key={event.id} event={event} selected={event.id === selectedId} view={view} />
        ))}
      </ul>
      {past.length > 0 && (
        <details className="group mt-2 border-t pt-2" open={past.some((event) => event.id === selectedId)}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center px-2 text-[15px] font-semibold text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
            Vergangene ({past.length})
          </summary>
          <ul className="grid gap-0.5">
            {past.map((event) => (
              <RailItem key={event.id} event={event} selected={event.id === selectedId} view={view} past />
            ))}
          </ul>
        </details>
      )}
    </nav>
  );
}
