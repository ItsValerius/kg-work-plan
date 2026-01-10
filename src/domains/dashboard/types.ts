// Shared types for dashboard components

import type { events, taskParticipants } from "@/db/schema";

export interface TaskStat {
  taskId: string;
  taskName: string;
  currentParticipants: number;
  requiredParticipants: number;
  startTime: Date;
}

export interface ShiftStat {
  shiftId: string;
  shiftName: string;
  totalParticipants: number;
  requiredParticipants: number;
  tasks: TaskStat[];
}

export interface EventStat {
  eventId: string;
  eventName: string;
  totalParticipants: number;
  requiredParticipants: number;
  shifts: ShiftStat[];
}

export interface BasicStatistics {
  totalParticipants: number;
  totalEvents: number;
  totalTasks: number;
  totalShifts: number;
  upcomingEvents: number;
  selfAssignedUsers: number;
  tasksLackingParticipants: number;
  tasksWithNoParticipants: number;
  totalRequiredParticipants: number;
  overallParticipationRate: number;
  tasksStartingSoon: number;
  fullyStaffedTasks: number;
}

export interface EventStatistics {
  eventStats: EventStat[];
}

export interface FilterOption {
  id: string;
  name: string;
}

export interface ShiftFilterOption extends FilterOption {
  eventName: string;
}

export interface TaskFilterOption extends FilterOption {
  shiftName: string;
}

export type ParticipantsUserTask = (typeof taskParticipants.$inferSelect) & {
  user: { name: string | null; email: string | null } | null;
  task: {
    name: string;
    startTime: Date;
    shift: {
      name: string;
      event: { name: string };
    };
  };
};

export interface ParticipantsData {
  userTasks: ParticipantsUserTask[];
  allEvents: (typeof events.$inferSelect)[];
  shiftsForFilter: ShiftFilterOption[];
  tasksForFilter: TaskFilterOption[];
}
