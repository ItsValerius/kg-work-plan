import type { EventWorkPlan } from "@/domains/events/queries";
import { formatDate, formatTime } from "@/lib/datetime";
import { HelperListActions, type CsvRow } from "./HelperListActions";
import { RemoveHelperButton } from "./RemoveHelperButton";
import { taskSpots } from "@/domains/tasks/spots";

export function HelperList({ event }: { event: EventWorkPlan }) {
  const rows: CsvRow[] = event.shifts.flatMap((shift) =>
    shift.tasks.flatMap((task) =>
      task.participants.map((p) => ({
        shift: `${shift.name} (${formatTime(shift.startTime)}–${formatTime(shift.endTime)})`,
        task: task.name,
        start: formatTime(task.startTime),
        name: p.user?.name ?? "",
        group: p.groupName ?? "",
        people: p.groupSize,
        email: p.user?.email ?? "",
      })),
    ),
  );
  const fileName = `helferliste-${event.name.toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-")}-${formatDate(event.startDate).replaceAll(".", "-")}.csv`;

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted-foreground print:hidden">
          {rows.length === 0
            ? "Noch niemand eingetragen."
            : `${rows.length} Einträge · druckfertig für den Tag`}
        </p>
        <HelperListActions rows={rows} fileName={fileName} />
      </div>

      {event.shifts.map((shift) => (
        <section
          key={shift.id}
          aria-labelledby={`liste-${shift.id}`}
          className="break-inside-avoid-page"
        >
          <h3
            id={`liste-${shift.id}`}
            className="flex items-baseline gap-3 border-b-2 border-foreground/80 pb-2"
          >
            <span className="tabular font-display text-[22px] leading-none font-bold text-primary print:text-foreground">
              {formatTime(shift.startTime)}–{formatTime(shift.endTime)}
            </span>
            <span className="text-lg font-semibold">{shift.name}</span>
          </h3>

          {shift.tasks.length === 0 && (
            <p className="py-3 text-muted-foreground">Keine Aufgaben.</p>
          )}

          {shift.tasks.map((task) => {
            const { open, filled, required } = taskSpots(task);
            return (
              <div key={task.id} className="break-inside-avoid border-b py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h4 className="font-semibold">
                    {task.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      · ab {formatTime(task.startTime)} Uhr
                    </span>
                  </h4>
                  <span
                    className={
                      open > 0 ? "text-primary print:text-foreground" : "text-muted-foreground"
                    }
                  >
                    <span className="tabular font-display text-[22px] leading-none font-bold">
                      {filled}/{required}
                    </span>
                    <span className="ml-1.5 text-[15px] font-semibold">
                      {open > 0 ? `${open} frei` : "voll"}
                    </span>
                  </span>
                </div>
                <ul className="mt-2 text-[15px]">
                  {task.participants.map((p) => {
                    const name = p.user?.name || "Ohne Namen";
                    const group =
                      p.groupName || p.groupSize > 1
                        ? `${p.groupName ? `„${p.groupName}“ · ` : ""}${p.groupSize} Pers.`
                        : "allein";
                    return (
                      <li
                        key={p.id}
                        className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-t border-dashed py-2 first:border-t-0 sm:grid-cols-[minmax(0,3fr)_minmax(0,2.4fr)_minmax(0,3fr)_auto] print:grid-cols-[minmax(0,3fr)_minmax(0,2.4fr)]"
                      >
                        <span className="min-w-0">
                          <span className="block font-medium sm:truncate">{name}</span>
                          <span className="block text-sm text-muted-foreground sm:hidden">
                            {group}
                            {/* Emails show on screen only, never on the printout. */}
                            {p.user?.email && (
                              <span className="print:hidden">
                                {" · "}
                                <a
                                  href={`mailto:${p.user.email}`}
                                  className="text-primary underline-offset-4 hover:underline"
                                >
                                  {p.user.email}
                                </a>
                              </span>
                            )}
                          </span>
                        </span>
                        <span className="hidden truncate text-muted-foreground sm:block">
                          {group}
                        </span>
                        <span className="hidden truncate sm:block print:hidden">
                          {p.user?.email && (
                            <a
                              href={`mailto:${p.user.email}`}
                              className="text-primary underline-offset-4 hover:underline print:text-foreground"
                            >
                              {p.user.email}
                            </a>
                          )}
                        </span>
                        <span className="justify-self-end print:hidden">
                          <RemoveHelperButton
                            participantId={p.id}
                            helperName={name}
                            taskName={task.name}
                          />
                        </span>
                      </li>
                    );
                  })}
                  {/* Open spots stay as blank lines: on screen a few, on paper all of them, for walk-ins on the day. */}
                  {Array.from({ length: open }).map((_, i) => (
                    <li
                      key={`frei-${i}`}
                      className={
                        i < 3
                          ? "border-t border-dashed py-2 text-muted-foreground first:border-t-0 print:py-3"
                          : "hidden border-t border-dashed py-3 text-muted-foreground print:block"
                      }
                    >
                      frei
                    </li>
                  ))}
                  {open > 3 && (
                    <li className="py-2 text-muted-foreground print:hidden">
                      + {open - 3} weitere freie Plätze
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
