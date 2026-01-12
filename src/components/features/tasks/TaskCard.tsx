import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskCardButton } from "./TaskCardButton";
import { ParticipantsProgress } from "./ParticipantsProgress";
import { TaskDetailsButton } from "./TaskDetailsButton";
import { TaskAdminActions } from "@/components/features/admin/TaskAdminActions";
import { getProgressBarColor, ALMOST_FULL_THRESHOLD } from "./utils";
import { tasks } from "@/db/schema/index";
import { formatTime } from "@/lib/datetime";
import { deleteTask } from "@/server/actions/events";
import { getTaskParticipants } from "@/domains/participants/queries";
import { getSession } from "@/lib/auth/utils";

interface TaskCardProps {
  eventId: string;
  shiftId: string;
  task: typeof tasks.$inferSelect;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

// Helper function to get card hover styles based on state
function getCardHoverStyles(isFull: boolean, isAlmostFull: boolean): string {
  if (isFull) return "hover:border-muted-foreground/30 opacity-90";
  if (isAlmostFull) return "hover:border-primary/40 hover:shadow-md";
  return "hover:border-primary/20";
}

export async function TaskCard({
  eventId,
  shiftId,
  task,
  isAdmin,
  isLoggedIn,
}: TaskCardProps) {
  const [participants, session] = await Promise.all([
    getTaskParticipants(task.id),
    getSession(),
  ]);

  const participantsAmount = participants.reduce(
    (accumulator, participant) => accumulator + participant.groupSize,
    0
  );

  const isFull = participantsAmount >= task.requiredParticipants;
  const progressPercentage = (participantsAmount / task.requiredParticipants) * 100;
  const isAlmostFull = progressPercentage >= ALMOST_FULL_THRESHOLD && !isFull;

  // Check if current user is already assigned to this task
  const currentUserId = session?.user?.id;
  const isUserAssigned = currentUserId
    ? participants.some((p) => p.userId === currentUserId)
    : false;

  const cardHoverStyles = getCardHoverStyles(isFull, isAlmostFull);
  const progressBarColor = getProgressBarColor(progressPercentage, isFull);

  return (
    <Card
      className={`flex flex-col transition-all duration-200 hover:shadow-lg h-full min-h-60 md:min-h-72 group ${cardHoverStyles}`}
    >
      <CardHeader className="pb-3 md:pb-4 lg:pb-5 flex flex-col justify-start min-h-24 md:min-h-28 lg:min-h-32 relative">
        {isAdmin ? (
          <TaskAdminActions
            eventId={eventId}
            shiftId={shiftId}
            taskId={task.id}
            deleteAction={deleteTask}
            task={task}
            participants={participants}
            isLoggedIn={isLoggedIn}
            isFull={isFull}
            progressPercentage={progressPercentage}
            progressBarColor={progressBarColor}
          />
        ) : (
          <TaskDetailsButton
            task={task}
            participants={participants}
            isLoggedIn={isLoggedIn}
            isFull={isFull}
            progressPercentage={progressPercentage}
            progressBarColor={progressBarColor}
          />
        )}
        <div className="flex items-start gap-2 md:gap-3 lg:gap-4 h-full">
          <div className="flex-1 min-w-0 flex flex-col space-y-1.5 md:space-y-2 justify-between h-full">
            <div className="flex items-start min-h-12 md:min-h-14 pr-10 md:pr-12">
              <CardTitle className="font-semibold wrap-break-word text-base md:text-lg leading-tight line-clamp-2 w-full">
                {task.name}
              </CardTitle>
            </div>
            <div className="flex items-start min-h-10 md:min-h-12 pr-10 md:pr-12">
              <div className="space-y-1 md:space-y-1.5 w-full">
                <small className="block text-xs md:text-sm text-muted-foreground font-medium">
                  ab {formatTime(new Date(task.startTime))}
                </small>
                {task.description && (
                  <CardDescription className="text-xs md:text-sm text-muted-foreground wrap-break-word line-clamp-2 md:line-clamp-2 min-h-8">
                    {task.description}
                  </CardDescription>
                )}
                {!task.description && <div className="min-h-10"></div>}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 md:space-y-3 pt-2 md:pt-3">
        <ParticipantsProgress
          participantsAmount={participantsAmount}
          requiredParticipants={task.requiredParticipants}
          progressPercentage={progressPercentage}
          isFull={isFull}
          isAlmostFull={isAlmostFull}
        />
      </CardContent>

      <CardFooter className="pt-3 md:pt-4 lg:pt-5">
        <TaskCardButton
          eventId={eventId}
          shiftId={shiftId}
          taskId={task.id}
          isFull={isFull}
          isUserAssigned={isUserAssigned}
        />

      </CardFooter>
    </Card>
  );
}
