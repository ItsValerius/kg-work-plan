import { Suspense } from "react";
import { getBasicStatistics } from "../shared/data/getDashboardData";
import { OverviewContent } from "./OverviewContent";
import { Skeleton } from "@/components/ui/skeleton";

async function OverviewContentWrapper() {
    const {
        totalParticipants,
        totalEvents,
        totalTasks,
        totalShifts,
        upcomingEvents,
        selfAssignedUsers,
        tasksLackingParticipants,
        tasksWithNoParticipants,
        totalRequiredParticipants,
        overallParticipationRate,
        tasksStartingSoon,
        fullyStaffedTasks,
    } = await getBasicStatistics();

    return (
        <OverviewContent
            totalParticipants={totalParticipants}
            totalEvents={totalEvents}
            totalTasks={totalTasks}
            totalShifts={totalShifts}
            upcomingEvents={upcomingEvents}
            participantsWithTasks={selfAssignedUsers}
            tasksLackingParticipants={tasksLackingParticipants}
            tasksWithNoParticipants={tasksWithNoParticipants}
            totalRequiredParticipants={totalRequiredParticipants}
            overallParticipationRate={overallParticipationRate}
            tasksStartingSoon={tasksStartingSoon}
            fullyStaffedTasks={fullyStaffedTasks}
        />
    );
}

function OverviewSkeleton() {
    return (
        <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>
        </div>
    );
}

export function OverviewTab() {
    return (
        <Suspense fallback={<OverviewSkeleton />}>
            <OverviewContentWrapper />
        </Suspense>
    );
}

