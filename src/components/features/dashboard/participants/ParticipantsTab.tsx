import { Suspense } from "react";
import { getParticipantsData } from "@/domains/dashboard/queries";
import { ParticipantsTable } from "./ParticipantsTable";
import { ParticipantsTableSkeleton } from "@/components/layout/Skeletons";

async function ParticipantsContent() {
  const { userTasks, allEvents, shiftsForFilter, tasksForFilter } = await getParticipantsData();

  return (
    <ParticipantsTable
      userTasks={userTasks}
      allEvents={allEvents}
      shiftsForFilter={shiftsForFilter}
      tasksForFilter={tasksForFilter}
    />
  );
}

export function ParticipantsTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-[32px] md:text-[44px]">Alle Helfer</h2>
      <p className="max-w-[65ch] text-[17px] text-muted-foreground">
        Alle Einträge über alle Veranstaltungen: filtern, mehrere auf einmal austragen oder als
        Liste exportieren.
      </p>
      <Suspense fallback={<ParticipantsTableSkeleton />}>
        <ParticipantsContent />
      </Suspense>
    </div>
  );
}
