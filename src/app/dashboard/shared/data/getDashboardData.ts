import db from "@/db";
import { events } from "@/db/schema";
import { gt } from "drizzle-orm";

// Basic statistics for overview tab
export async function getBasicStatistics() {
  const userTasks = await db.query.taskParticipants.findMany({
    with: {
      user: { columns: { name: true, email: true } },
      task: {
        columns: { name: true, startTime: true },
        with: {
          shift: {
            with: { event: { columns: { name: true } } },
            columns: { name: true },
          },
        },
      },
    },
  });

  const allEvents = await db.query.events.findMany();
  const futureEvents = await db.query.events.findMany({
    where: gt(events.endDate, new Date()),
  });

  const allTasks = await db.query.tasks.findMany({
    with: {
      shift: {
        with: { event: { columns: { id: true, name: true } } },
        columns: { id: true, name: true },
      },
      participants: true,
    },
  });

  const allShifts = await db.query.shifts.findMany({
    with: {
      event: { columns: { name: true } },
    },
  });

  const totalParticipants = userTasks.reduce(
    (sum, task) => sum + task.groupSize,
    0
  );
  const totalEvents = allEvents.length;
  const totalTasks = allTasks.length;
  const totalShifts = allShifts.length;
  const upcomingEvents = futureEvents.length;

  const selfAssignedUsers = new Set(
    userTasks
      .filter((task) => task.userId !== null)
      .map((task) => task.userId!)
  ).size;

  const tasksLackingParticipants = allTasks.filter((task) => {
    const currentParticipants = task.participants.reduce(
      (sum, p) => sum + p.groupSize,
      0
    );
    return currentParticipants < task.requiredParticipants;
  }).length;

  const tasksWithNoParticipants = allTasks.filter((task) => {
    const currentParticipants = task.participants.reduce(
      (sum, p) => sum + p.groupSize,
      0
    );
    return currentParticipants === 0;
  }).length;

  const totalRequiredParticipants = allTasks.reduce(
    (sum, task) => sum + task.requiredParticipants,
    0
  );

  const overallParticipationRate =
    totalRequiredParticipants > 0
      ? (totalParticipants / totalRequiredParticipants) * 100
      : 0;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const tasksStartingSoon = allTasks.filter((task) => {
    const taskStart = new Date(task.startTime);
    return taskStart >= now && taskStart <= dayAfterTomorrow;
  }).length;

  const fullyStaffedTasks = allTasks.filter((task) => {
    const currentParticipants = task.participants.reduce(
      (sum, p) => sum + p.groupSize,
      0
    );
    return currentParticipants >= task.requiredParticipants;
  }).length;

  return {
    totalParticipants,
    totalEvents,
    totalTasks,
    totalShifts,
    upcomingEvents,
    selfAssignedUsers,
    tasksLackingParticipants,
    // Additional calculated metrics
    tasksWithNoParticipants,
    totalRequiredParticipants,
    overallParticipationRate,
    tasksStartingSoon,
    fullyStaffedTasks,
  };
}

// Event statistics for events tab
export async function getEventStatistics() {
  const allTasks = await db.query.tasks.findMany({
    with: {
      shift: {
        with: { event: { columns: { id: true, name: true } } },
        columns: { id: true, name: true },
      },
      participants: true,
    },
  });

  const eventStatsMap = new Map<string, {
    eventId: string;
    eventName: string;
    totalParticipants: number;
    requiredParticipants: number;
    shifts: Map<string, {
      shiftId: string;
      shiftName: string;
      totalParticipants: number;
      requiredParticipants: number;
      tasks: Array<{
        taskId: string;
        taskName: string;
        currentParticipants: number;
        requiredParticipants: number;
        startTime: Date;
      }>;
    }>;
  }>();

  allTasks.forEach((task) => {
    const event = task.shift.event;
    const shift = task.shift;

    if (!eventStatsMap.has(event.id)) {
      eventStatsMap.set(event.id, {
        eventId: event.id,
        eventName: event.name,
        totalParticipants: 0,
        requiredParticipants: 0,
        shifts: new Map(),
      });
    }
    const eventStat = eventStatsMap.get(event.id)!;

    if (!eventStat.shifts.has(shift.id)) {
      eventStat.shifts.set(shift.id, {
        shiftId: shift.id,
        shiftName: shift.name,
        totalParticipants: 0,
        requiredParticipants: 0,
        tasks: [],
      });
    }
    const shiftStat = eventStat.shifts.get(shift.id)!;

    const currentParticipants = task.participants.reduce(
      (sum, p) => sum + p.groupSize,
      0
    );

    shiftStat.tasks.push({
      taskId: task.id,
      taskName: task.name,
      currentParticipants,
      requiredParticipants: task.requiredParticipants,
      startTime: task.startTime,
    });

    shiftStat.totalParticipants += currentParticipants;
    shiftStat.requiredParticipants += task.requiredParticipants;
  });

  const eventStats = Array.from(eventStatsMap.values()).map((eventStat) => {
    eventStat.totalParticipants = Array.from(eventStat.shifts.values()).reduce(
      (sum, shift) => sum + shift.totalParticipants,
      0
    );
    eventStat.requiredParticipants = Array.from(eventStat.shifts.values()).reduce(
      (sum, shift) => sum + shift.requiredParticipants,
      0
    );

    return {
      eventId: eventStat.eventId,
      eventName: eventStat.eventName,
      totalParticipants: eventStat.totalParticipants,
      requiredParticipants: eventStat.requiredParticipants,
      shifts: Array.from(eventStat.shifts.values()),
    };
  });

  return { eventStats };
}

// Participants data for participants tab
export async function getParticipantsData() {
  const userTasks = await db.query.taskParticipants.findMany({
    with: {
      user: { columns: { name: true, email: true } },
      task: {
        columns: { name: true, startTime: true },
        with: {
          shift: {
            with: { event: { columns: { name: true } } },
            columns: { name: true },
          },
        },
      },
    },
  });

  const allEvents = await db.query.events.findMany();

  const allShifts = await db.query.shifts.findMany({
    with: {
      event: { columns: { name: true } },
    },
  });

  const allTasks = await db.query.tasks.findMany({
    with: {
      shift: {
        with: { event: { columns: { id: true, name: true } } },
        columns: { id: true, name: true },
      },
      participants: true,
    },
  });

  const shiftsForFilter = allShifts.map((shift) => ({
    id: shift.id,
    name: shift.name,
    eventName: shift.event.name,
  }));

  const tasksForFilter = allTasks.map((task) => ({
    id: task.id,
    name: task.name,
    shiftName: task.shift.name,
  }));

  return {
    userTasks,
    allEvents,
    shiftsForFilter,
    tasksForFilter,
  };
}