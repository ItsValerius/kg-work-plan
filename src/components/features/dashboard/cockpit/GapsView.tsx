import type { EventWorkPlan } from "@/domains/events/queries";
import { formatTime } from "@/lib/datetime";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { taskSpots } from "./spots";

export function GapsView({ event }: { event: EventWorkPlan }) {
  const shiftsWithGaps = event.shifts
    .map((shift) => ({
      shift,
      tasks: shift.tasks.map((task) => ({ task, ...taskSpots(task) })).filter((t) => t.open > 0),
    }))
    .filter((entry) => entry.tasks.length > 0);

  if (event.shifts.length === 0 || event.shifts.every((shift) => shift.tasks.length === 0)) {
    return (
      <div className="rounded-lg bg-muted p-6">
        <p className="text-[17px] font-semibold">Für diese Veranstaltung gibt es noch keine Aufgaben.</p>
        <p className="mt-1 text-muted-foreground">Leg unter „Planen“ Schichten und Aufgaben an.</p>
        <Button asChild className="mt-4">
          <Link href={`/dashboard?event=${event.id}&ansicht=planen`}>Jetzt planen</Link>
        </Button>
      </div>
    );
  }

  if (shiftsWithGaps.length === 0) {
    return (
      <div className="rounded-lg bg-accent p-6 text-primary-dark">
        <p className="font-display text-[32px] font-bold leading-none">Alles besetzt</p>
        <p className="mt-2">Jede Aufgabe hat genug Helfer. Die Liste für den Tag findest du unter „Helferliste“.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {shiftsWithGaps.map(({ shift, tasks }) => (
        <section key={shift.id} aria-labelledby={`luecke-${shift.id}`}>
          <h3 id={`luecke-${shift.id}`} className="flex items-baseline gap-3 border-b-2 border-foreground/80 pb-2">
            <span className="font-display text-[22px] font-bold leading-none text-primary tabular">
              {formatTime(shift.startTime)}–{formatTime(shift.endTime)}
            </span>
            <span className="text-lg font-semibold">{shift.name}</span>
          </h3>
          <ul>
            {tasks.map(({ task, open, filled, required }) => (
              <li key={task.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b py-3.5">
                <span className="min-w-0">
                  <span className="block font-semibold">{task.name}</span>
                  <span className="block text-[15px] text-muted-foreground">
                    ab {formatTime(task.startTime)} Uhr · {filled} von {required} eingetragen
                  </span>
                </span>
                <span className="text-right leading-none tabular">
                  <span className="font-display text-[32px] font-bold text-primary">{open}</span>
                  <span className="block text-[12px] font-semibold uppercase text-primary">frei</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
