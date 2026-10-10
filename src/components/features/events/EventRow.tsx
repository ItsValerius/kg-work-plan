import type { Event } from "@/domains/events/types";
import { formatShortDate, isSameBerlinDay } from "@/lib/datetime";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { DateBlock } from "./DateBlock";
import { OpenSpots } from "./OpenSpots";

interface EventRowProps {
  event: Event;
  openSpots: number;
  requiredSpots: number;
  isPast: boolean;
}

export const EventRow = ({ event, openSpots, requiredSpots, isPast }: EventRowProps) => {
  const multiDay = !isSameBerlinDay(event.startDate, event.endDate);

  return (
    <li className="group relative border-b">
      <Link
        href={`/veranstaltungen/${event.id}`}
        className="grid grid-cols-[88px_1fr_auto] items-center gap-x-4 gap-y-1 py-5 pr-2 transition-colors hover:bg-muted md:grid-cols-[120px_1fr_auto] md:gap-x-8 md:py-6"
      >
        <DateBlock date={event.startDate} muted={isPast} className="pl-1 md:pl-3" />
        <div className="min-w-0">
          <h3
            className={
              isPast
                ? "text-lg leading-snug font-semibold text-muted-foreground md:text-xl"
                : "text-lg leading-snug font-semibold tracking-[-0.01em] md:text-xl"
            }
          >
            {event.name}
          </h3>
          {multiDay && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              bis {formatShortDate(event.endDate)}
            </p>
          )}
          {!isPast && <OpenSpots open={openSpots} required={requiredSpots} className="mt-1.5" />}
        </div>
        <ChevronRight
          className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
};
