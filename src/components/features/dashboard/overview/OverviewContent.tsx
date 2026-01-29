"use client";

import { StatisticsCards } from "./StatisticsCards";

interface OverviewContentProps {
    totalParticipants: number;
    totalEvents: number;
    totalTasks: number;
    totalShifts: number;
    upcomingEvents: number;
    participantsWithTasks: number;
    tasksLackingParticipants: number;
    tasksWithNoParticipants: number;
    totalRequiredParticipants: number;
    overallParticipationRate: number;
    tasksStartingSoon: number;
    fullyStaffedTasks: number;
}

export function OverviewContent({
    totalParticipants,
    totalEvents,
    totalTasks,
    totalShifts,
    upcomingEvents,
    participantsWithTasks,
    tasksLackingParticipants,
    tasksWithNoParticipants,
    totalRequiredParticipants,
    overallParticipationRate,
    tasksStartingSoon,
    fullyStaffedTasks,
}: OverviewContentProps) {
    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Statistiken</h2>
            <StatisticsCards
                totalParticipants={totalParticipants}
                totalEvents={totalEvents}
                totalTasks={totalTasks}
                totalShifts={totalShifts}
                upcomingEvents={upcomingEvents}
                participantsWithTasks={participantsWithTasks}
                tasksLackingParticipants={tasksLackingParticipants}
                tasksWithNoParticipants={tasksWithNoParticipants}
                totalRequiredParticipants={totalRequiredParticipants}
                overallParticipationRate={overallParticipationRate}
                tasksStartingSoon={tasksStartingSoon}
                fullyStaffedTasks={fullyStaffedTasks}
            />
        </div>
    );
}

