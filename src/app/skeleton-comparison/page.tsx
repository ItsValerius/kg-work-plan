import { PageContainer } from "@/components/layout/PageContainer";
import { SkeletonCard } from "@/components/features/tasks/SkeletonCard";
import { TaskCard } from "@/components/features/tasks/TaskCard";
import { EventCard } from "@/components/features/events/EventCard";
import { EventSkeletonCard } from "@/components/features/events/EventSkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdmin, isLoggedIn } from "@/lib/auth/utils";
import { getMissingUsersPerEvent } from "@/domains/events/queries";
import db from "@/db";
import { Suspense } from "react";

async function getFirstTaskWithRelations() {
  const task = await db.query.tasks.findFirst({
    with: {
      shift: {
        with: {
          event: true,
        },
      },
    },
  });

  if (!task || !task.shift) {
    return null;
  }

  return {
    task,
    eventId: task.shift.event.id,
    shiftId: task.shift.id,
  };
}

async function getFirstEventWithCounts() {
  const event = await db.query.events.findFirst();

  if (!event) {
    return null;
  }

  const counts = await getMissingUsersPerEvent(event.id);

  return {
    event,
    ...counts,
  };
}

export default async function SkeletonComparisonPage() {
  const [userIsAdmin, userIsLoggedIn, taskData, eventData] = await Promise.all([
    isAdmin(),
    isLoggedIn(),
    getFirstTaskWithRelations(),
    getFirstEventWithCounts(),
  ]);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Card Comparisons
        </h1>
        <p className="text-muted-foreground mt-2">
          Compare skeleton cards (loading states) with actual cards
        </p>
      </div>

      <div className="space-y-8">
        {/* TaskCard Comparison */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>TaskCard Comparison</CardTitle>
          </CardHeader>
          {taskData ? (
            <CardContent className="grid gap-3 md:gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
              <SkeletonCard />
              <Suspense fallback={<SkeletonCard />}>
                <TaskCard
                  eventId={taskData.eventId}
                  shiftId={taskData.shiftId}
                  task={taskData.task}
                  isAdmin={userIsAdmin}
                  isLoggedIn={userIsLoggedIn}
                />
              </Suspense>
            </CardContent>
          ) : (
            <CardContent>
              <p className="text-muted-foreground">
                No tasks found in the database. Please create an event with tasks first to see the comparison.
              </p>
            </CardContent>
          )}
        </Card>

        {/* EventCard Comparison */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>EventCard Comparison</CardTitle>
          </CardHeader>
          {eventData ? (
            <CardContent className="grid gap-4 md:gap-6 lg:grid-cols-3 items-stretch">
              <EventSkeletonCard />
              <EventCard
                event={eventData.event}
                userIsAdmin={userIsAdmin}
                currentParticipantsCount={eventData.currentParticipantsCount}
                requiredParticipantsCount={eventData.requiredParticipantsCount}
              />
            </CardContent>
          ) : (
            <CardContent>
              <p className="text-muted-foreground">
                No events found in the database. Please create an event first to see the comparison.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
