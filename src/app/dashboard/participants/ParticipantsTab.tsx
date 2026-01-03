import { Suspense } from "react";
import { getParticipantsData } from "../shared/data/getDashboardData";
import { ParticipantsTable } from "./ParticipantsTable";
import { Skeleton } from "@/components/ui/skeleton";

async function ParticipantsContent() {
    const { userTasks, allEvents, shiftsForFilter, tasksForFilter } =
        await getParticipantsData();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Teilnehmer Übersicht</h2>
            <p className="text-muted-foreground">
                Verwalten Sie alle Teilnehmer-Zuweisungen mit erweiterten Filtern und Export-Funktionen.
            </p>
            <ParticipantsTable
                userTasks={userTasks}
                allEvents={allEvents}
                shiftsForFilter={shiftsForFilter}
                tasksForFilter={tasksForFilter}
            />
        </div>
    );
}

function ParticipantsSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
}

export function ParticipantsTab() {
    return (
        <Suspense fallback={<ParticipantsSkeleton />}>
            <ParticipantsContent />
        </Suspense>
    );
}

