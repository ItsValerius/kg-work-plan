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

