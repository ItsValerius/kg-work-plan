// Shared types for dashboard components

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

export interface ParticipantsData {
  userTasks: unknown[]; // Type this properly based on the query result
  allEvents: unknown[]; // Type this properly based on the query result
  shiftsForFilter: ShiftFilterOption[];
  tasksForFilter: TaskFilterOption[];
}
