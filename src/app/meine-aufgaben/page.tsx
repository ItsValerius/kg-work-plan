import { DateBlock } from "@/components/features/events/DateBlock";
import { PageContainer } from "@/components/layout/PageContainer";
import { MyTasksSkeleton } from "@/components/layout/Skeletons";
import RemoveUserFromTaskButton from "@/components/shared/buttons/RemoveUserFromTaskButton";
import { EditGroupDialog } from "@/components/shared/dialogs/EditGroupDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { getUserTasks, type UserTask } from "@/domains/tasks/queries";
import { getAuthenticatedUser } from "@/lib/auth/utils";
import { formatShortDate, formatTime } from "@/lib/datetime";
import { isUpcomingTask } from "@/domains/tasks/upcoming";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Meine Aufgaben",
};

function TaskMeta({ task, showStart = true }: { task: UserTask; showStart?: boolean }) {
  return (
    <>
      <p className="mt-1 text-[15px] text-muted-foreground">
        {showStart && `ab ${formatTime(task.startTime)} Uhr · `}Schicht {task.shiftName} (
        {formatTime(task.shiftDate)}–{formatTime(task.shiftEndTime)} Uhr)
      </p>
      {(task.groupName || task.groupSize > 1) && (
        <p className="mt-1 text-[15px] text-muted-foreground">
          {task.groupName ? `Gruppe „${task.groupName}“` : "Gruppe"}
          {task.groupSize > 1 && ` · ${task.groupSize} Personen`}
        </p>
      )}
    </>
  );
}

function TaskActions({ task }: { task: UserTask }) {
  return (
    <div className="-ml-3 flex flex-wrap items-center gap-x-1">
      <Link
        href={`/veranstaltungen/${task.eventId}#aufgabe-${task.id}`}
        className={cn(buttonVariants({ variant: "link" }), "min-h-11 px-3")}
      >
        Zum Arbeitsplan
      </Link>
      <EditGroupDialog
        participantId={task.participantId}
        currentGroupName={task.groupName}
        currentGroupSize={task.groupSize}
        trigger={
          <Button variant="ghost" className="px-3">
            {task.groupName || task.groupSize > 1 ? "Gruppe ändern" : "Gruppe angeben"}
          </Button>
        }
      />
      <RemoveUserFromTaskButton taskId={task.id} taskName={task.name} />
    </div>
  );
}

const MeineAufgabenPage = () => {
  return (
    <PageContainer>
      <h1 className="text-[48px] md:text-[clamp(56px,5.7vw,80px)]">Meine Aufgaben</h1>
      <Suspense fallback={<MyTasksSkeleton />}>
        <MyTasks />
      </Suspense>
    </PageContainer>
  );
};

async function MyTasks() {
  const user = await getAuthenticatedUser("/meine-aufgaben");
  const userTasks = await getUserTasks(user.id);

  const isUpcoming = (task: UserTask) =>
    isUpcomingTask({ start: task.startTime, shiftEndTime: task.shiftEndTime });
  const upcoming = userTasks.filter(isUpcoming);
  const past = userTasks.filter((task) => !isUpcoming(task)).reverse();
  const [next, ...later] = upcoming;

  return (
    <>
      <p className="mt-3 text-[17px] text-muted-foreground">
        {upcoming.length === 0
          ? "Du bist gerade für keine anstehende Aufgabe eingetragen."
          : `Du hilfst bei ${upcoming.length} ${upcoming.length === 1 ? "Aufgabe" : "Aufgaben"} – danke!`}
      </p>

      {next && (
        <section
          aria-labelledby="naechster-einsatz"
          className="mt-10 rounded-xl border-[1.5px] border-primary bg-accent/40 p-5 md:p-8"
        >
          <h2 id="naechster-einsatz" className="text-[28px] text-primary-dark md:text-[32px]">
            Dein nächster Einsatz
          </h2>
          <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-[auto_1fr]">
            <DateBlock date={next.startTime} size="lg" />
            <div className="min-w-0">
              <p className="tabular font-display text-[34px] leading-none font-bold text-primary md:text-[40px]">
                {formatTime(next.startTime)} Uhr
              </p>
              <h3 className="mt-2 text-[22px] leading-snug font-semibold md:text-2xl">
                {next.name}
              </h3>
              <p className="mt-1 text-[17px]">
                {next.eventName} · {formatShortDate(next.startTime)}
              </p>
              <TaskMeta task={next} showStart={false} />
              {next.description && next.description.trim() !== "" && (
                <p className="mt-3 max-w-[65ch] text-[17px] leading-relaxed">{next.description}</p>
              )}
              <div className="mt-4">
                <TaskActions task={next} />
              </div>
            </div>
          </div>
        </section>
      )}

      {later.length > 0 && (
        <section aria-labelledby="weitere-einsaetze" className="mt-14">
          <h2 id="weitere-einsaetze" className="text-[32px] md:text-[44px]">
            Danach
          </h2>
          <ol className="mt-6 border-t">
            {later.map((task) => (
              <TaskRow key={task.participantId} task={task} />
            ))}
          </ol>
        </section>
      )}

      {upcoming.length === 0 && (
        <div className="mt-10 rounded-xl border bg-muted px-6 py-10 md:px-10">
          <h2 className="text-[32px]">Wo wirst du gebraucht?</h2>
          <p className="mt-2 max-w-[60ch] text-[17px] text-muted-foreground">
            Bei den Veranstaltungen siehst du, welche Aufgaben noch freie Plätze haben. Ein Klick
            auf „Hier eintragen“ genügt.
          </p>
          <Link href="/veranstaltungen" className={cn(buttonVariants(), "mt-6")}>
            Zu den Veranstaltungen
            <ChevronRight aria-hidden="true" />
          </Link>
        </div>
      )}

      {past.length > 0 && (
        <details className="group mt-14 border-t pt-6">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-[17px] font-semibold text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
            <ChevronRight
              className="size-5 transition-transform group-open:rotate-90"
              aria-hidden="true"
            />
            Vergangene Einsätze ({past.length})
          </summary>
          <ol className="mt-4 border-t">
            {past.map((task) => (
              <TaskRow key={task.participantId} task={task} isPast />
            ))}
          </ol>
        </details>
      )}
    </>
  );
}

function TaskRow({ task, isPast = false }: { task: UserTask; isPast?: boolean }) {
  return (
    <li className="grid grid-cols-[88px_1fr] gap-x-4 border-b py-5 md:grid-cols-[120px_1fr_auto] md:items-center md:gap-x-8">
      <DateBlock date={task.startTime} muted={isPast} className="pl-1 md:pl-3" />
      <div className="min-w-0">
        <h3
          className={cn(
            "text-lg leading-snug font-semibold md:text-xl",
            isPast && "text-muted-foreground",
          )}
        >
          {task.name}
        </h3>
        <p className="text-[15px]">{task.eventName}</p>
        <TaskMeta task={task} />
      </div>
      {!isPast && (
        <div className="col-span-2 mt-3 md:col-span-1 md:mt-0">
          <TaskActions task={task} />
        </div>
      )}
    </li>
  );
}

export default MeineAufgabenPage;
