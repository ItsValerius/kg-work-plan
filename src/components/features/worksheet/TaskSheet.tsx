import type { EventWorkPlan } from "@/domains/events/queries";
import { taskSpots } from "@/domains/tasks/spots";
import { formatTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ClaimLine } from "./ClaimLine";

type Task = EventWorkPlan["shifts"][number]["tasks"][number];

interface TaskSheetProps {
  eventId: string;
  shiftId: string;
  task: Task;
  viewerId: string | null;
  justClaimed: boolean;
}

/** Empty lines shown after the claim line before the rest folds into one sentence. */
const VISIBLE_EMPTY_LINES = 2;

/** Gives every sign-up its line numbers on the sheet; a group takes one line per person. */
function numberEntries(participants: Task["participants"]) {
  const entries: { participant: Task["participants"][number]; from: number; to: number }[] = [];
  let line = 1;
  for (const participant of participants) {
    entries.push({ participant, from: line, to: line + participant.groupSize - 1 });
    line += participant.groupSize;
  }
  return { entries, firstEmptyLine: line };
}

function lineRange(from: number, to: number) {
  return from === to ? `${from}` : `${from}–${to}`;
}

/**
 * One task as the club's paper sign-up sheet: a numbered line per helper needed.
 */
export function TaskSheet({ eventId, shiftId, task, viewerId, justClaimed }: TaskSheetProps) {
  const isLoggedIn = viewerId !== null;
  const { filled, required, open } = taskSpots(task);
  const isFull = open === 0;
  const viewerIsOnSheet = task.participants.some((p) => p.userId === viewerId);

  const numbered = numberEntries(task.participants);
  const firstEmptyLine = numbered.firstEmptyLine;
  const entries = numbered.entries.map((entry) => ({
    ...entry,
    isOwn: entry.participant.userId !== null && entry.participant.userId === viewerId,
    name: entry.participant.groupName || entry.participant.user?.name || "Ohne Namen",
  }));
  const canClaim = !isFull && !viewerIsOnSheet;
  const quietEmptyCount = Math.min(open - (canClaim ? 1 : 0), VISIBLE_EMPTY_LINES);
  const foldedEmptyCount = open - (canClaim ? 1 : 0) - quietEmptyCount;
  const firstQuietLine = firstEmptyLine + (canClaim ? 1 : 0);

  return (
    <article
      id={`aufgabe-${task.id}`}
      aria-labelledby={`aufgabe-${task.id}-titel`}
      className="relative scroll-mt-24 border-t-2 border-foreground/80"
    >
      <header className="flex items-start justify-between gap-4 border-b pt-3 pb-3 md:pt-4">
        <div className="min-w-0">
          <h3
            id={`aufgabe-${task.id}-titel`}
            className="text-xl leading-snug font-semibold tracking-[-0.015em]"
          >
            {task.name}
          </h3>
          <p className="mt-1 text-[15px] text-muted-foreground">
            ab {formatTime(task.startTime)} Uhr
            {task.description && task.description.trim() !== "" && <> · {task.description}</>}
          </p>
        </div>
        <p
          className={cn(
            "tabular shrink-0 text-right leading-none",
            isFull ? "text-muted-foreground" : "text-primary",
          )}
        >
          <span className="font-display text-[30px] font-bold">{filled}</span>
          <span className="font-display text-[20px] font-bold text-muted-foreground">
            /{required}
          </span>
          <span className="mt-1 block text-[12px] font-semibold uppercase">
            {isFull ? "voll" : `${open} frei`}
          </span>
        </p>
      </header>

      <ol className="pb-2" aria-label={`Helferliste ${task.name}`}>
        {entries.map(({ participant, from, to, isOwn, name }) => (
          <li
            key={participant.id}
            className={cn(
              "grid grid-cols-[44px_1fr_auto] items-center gap-x-2 border-b py-3 md:grid-cols-[52px_1fr_auto]",
              isOwn && "-mx-2 rounded-md border-transparent bg-accent px-2",
              isOwn && justClaimed && "animate-claim",
            )}
          >
            <span
              className={cn(
                "tabular font-display text-[22px] leading-none font-bold",
                isOwn ? "text-primary-dark" : "text-muted-foreground",
              )}
              aria-label={`Platz ${lineRange(from, to)}`}
            >
              {lineRange(from, to)}
            </span>
            <span className="min-w-0">
              {isLoggedIn ? (
                <span
                  className={cn(
                    "flex items-center gap-2 text-[17px]",
                    isOwn && "font-semibold text-primary-dark",
                  )}
                >
                  <span className="truncate">{name}</span>
                  {isOwn && (
                    <span className="shrink-0 rounded-sm bg-primary px-1.5 py-0.5 text-[12px] leading-none font-semibold text-primary-foreground">
                      du
                    </span>
                  )}
                </span>
              ) : (
                <span className="block text-[17px] text-muted-foreground">belegt</span>
              )}
              {participant.groupSize > 1 && (
                <span
                  className={cn(
                    "block text-sm",
                    isOwn ? "text-primary-dark" : "text-muted-foreground",
                  )}
                >
                  Gruppe · {participant.groupSize} Personen
                </span>
              )}
            </span>
            {isOwn && (
              <Link
                href={`/events/${eventId}/shifts/${shiftId}/tasks/${task.id}`}
                className="rounded-md px-2 py-2 text-[15px] font-semibold text-primary-dark underline-offset-4 hover:underline"
              >
                Ändern
              </Link>
            )}
          </li>
        ))}

        {canClaim && (
          <ClaimLine
            eventId={eventId}
            taskId={task.id}
            taskName={task.name}
            lineNumber={firstEmptyLine}
            openSpots={open}
            isLoggedIn={isLoggedIn}
          />
        )}

        {Array.from({ length: Math.max(0, quietEmptyCount) }).map((_, index) => (
          <li
            key={`frei-${index}`}
            className="grid grid-cols-[44px_1fr] items-center gap-x-2 border-b border-dashed py-3 md:grid-cols-[52px_1fr]"
          >
            <span
              className="tabular font-display text-[22px] leading-none font-bold text-input"
              aria-hidden="true"
            >
              {firstQuietLine + index}
            </span>
            <span className="text-[15px] text-muted-foreground">frei</span>
          </li>
        ))}

        {foldedEmptyCount > 0 && (
          <li className="py-3 pl-[44px] text-[15px] text-muted-foreground md:pl-[52px]">
            + {foldedEmptyCount}{" "}
            {foldedEmptyCount === 1 ? "weiterer freier Platz" : "weitere freie Plätze"}
          </li>
        )}

        {isFull && entries.length === 0 && (
          <li className="py-3 text-[15px] text-muted-foreground">
            Für diese Aufgabe werden keine Helfer gebraucht.
          </li>
        )}
      </ol>
    </article>
  );
}
