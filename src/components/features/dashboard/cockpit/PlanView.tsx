import { EditDeleteActions } from "@/components/features/admin/EditDeleteActions";
import type { EventWorkPlan } from "@/domains/events/queries";
import { formatShortDate, formatTime, isSameBerlinDay, toBerlinInputParts } from "@/lib/datetime";
import { deleteShift, deleteTask } from "@/server/actions/events";
import { QuickAddShift } from "./QuickAddShift";
import { QuickAddTask } from "./QuickAddTask";
import { taskSpots } from "@/domains/tasks/spots";

/**
 * The organizer's planning view: every shift with its tasks, and inline rows to add
 * more of both without leaving the event.
 */
export function PlanView({ event }: { event: EventWorkPlan }) {
  const multiDay = !isSameBerlinDay(event.startDate, event.endDate);
  const lastShift = event.shifts.at(-1);
  const eventStart = toBerlinInputParts(event.startDate);
  // A new shift most likely starts where the last one ended. Events are stored at
  // midnight, so a first shift gets a daytime start instead of 00:00.
  const suggestedStart = lastShift
    ? toBerlinInputParts(lastShift.endTime).time
    : eventStart.time === "00:00"
      ? "10:00"
      : eventStart.time;

  return (
    <div className="grid gap-10">
      {event.shifts.length === 0 && (
        <p className="text-[17px] text-muted-foreground">
          Noch keine Schichten. Leg die erste an, dann kommen die Aufgaben dazu.
        </p>
      )}

      {event.shifts.map((shift) => {
        const shiftParts = toBerlinInputParts(shift.startTime);
        return (
          <section key={shift.id} aria-labelledby={`plan-${shift.id}`}>
            <div className="flex items-start justify-between gap-4 border-b-2 border-foreground/80 pb-2">
              <h3 id={`plan-${shift.id}`} className="flex flex-wrap items-baseline gap-x-3">
                <span className="tabular font-display text-[22px] leading-none font-bold text-primary">
                  {formatTime(shift.startTime)}–{formatTime(shift.endTime)}
                </span>
                <span className="text-lg font-semibold">{shift.name}</span>
                {multiDay && (
                  <span className="text-[15px] font-normal text-muted-foreground">
                    {formatShortDate(shift.startTime)}
                  </span>
                )}
              </h3>
              <div className="-mt-2">
                <EditDeleteActions
                  id={shift.id}
                  name={shift.name}
                  kind="Schicht"
                  editHref={`/veranstaltungen/${event.id}/schichten/${shift.id}/bearbeiten`}
                  deleteAction={deleteShift}
                />
              </div>
            </div>

            <ul>
              {shift.tasks.map((task) => {
                const { filled, required, open } = taskSpots(task);
                return (
                  <li
                    key={task.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b py-3"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold">{task.name}</span>
                      <span className="block text-[15px] text-muted-foreground">
                        ab {formatTime(task.startTime)} Uhr
                        {task.description && task.description.trim() !== "" && (
                          <> · {task.description}</>
                        )}
                      </span>
                    </span>
                    <span className={open > 0 ? "text-primary" : "text-muted-foreground"}>
                      <span className="tabular font-display text-[22px] leading-none font-bold">
                        {filled}/{required}
                      </span>
                    </span>
                    <EditDeleteActions
                      id={task.id}
                      name={task.name}
                      kind="Aufgabe"
                      editHref={`/veranstaltungen/${event.id}/schichten/${shift.id}/aufgaben/${task.id}/bearbeiten`}
                      deleteAction={deleteTask}
                    />
                  </li>
                );
              })}
            </ul>

            <div className="mt-4">
              <QuickAddTask
                eventId={event.id}
                shiftId={shift.id}
                shiftDay={shiftParts.day}
                shiftStart={shiftParts.time}
              />
            </div>
          </section>
        );
      })}

      <div className="border-t pt-6">
        <QuickAddShift
          eventId={event.id}
          eventDay={eventStart.day}
          suggestedStart={suggestedStart}
          startOpen={event.shifts.length === 0}
        />
      </div>
    </div>
  );
}
