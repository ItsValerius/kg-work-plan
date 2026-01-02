import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import db from "@/db/index";
import { taskParticipants, tasks } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { formatTime } from "@/lib/formatters";
import { deleteTask } from "./actions";
import { TaskAdminActions } from "@/components/admin-actions/TaskAdminActions";

interface TaskCardProps {
  eventId: string;
  shiftId: string;
  task: typeof tasks.$inferSelect;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export async function TaskCard({
  eventId,
  shiftId,
  task,
  isAdmin,
  isLoggedIn,
}: TaskCardProps) {
  const participants = await db.query.taskParticipants.findMany({
    where: eq(taskParticipants.taskId, task.id),
    with: {
      user: true,
    },
  });

  const participantsAmount = participants.reduce(
    (accumulator, participant) => accumulator + participant.groupSize,
    0
  );

  const isFull = participantsAmount >= task.requiredParticipants;
  const progressPercentage = (participantsAmount / task.requiredParticipants) * 100;
  const isAlmostFull = progressPercentage >= 80 && !isFull;

  return (
    <Card
      className={`flex flex-col transition-all duration-200 hover:shadow-lg h-full min-h-[240px] md:min-h-[280px] group ${isFull
        ? "hover:border-muted-foreground/30 opacity-90"
        : isAlmostFull
          ? "hover:border-primary/40 hover:shadow-md"
          : "hover:border-primary/20"
        }`}
    >
      <CardHeader className="pb-3 md:pb-4 lg:pb-5 flex flex-col justify-start min-h-[100px] md:min-h-[110px] lg:min-h-[120px] relative">
        {isAdmin && (
          <TaskAdminActions
            eventId={eventId}
            shiftId={shiftId}
            taskId={task.id}
            deleteAction={deleteTask}
          />
        )}
        <div className="flex items-start gap-2 md:gap-3 lg:gap-4 h-full">
          <div className="flex-1 min-w-0 flex flex-col space-y-1.5 md:space-y-2 justify-between h-full">
            <div className="flex items-start min-h-[3rem] md:min-h-[3.5rem]">
              <CardTitle className="font-semibold break-words text-base md:text-lg leading-tight line-clamp-2 w-full">
                {task.name}
              </CardTitle>
            </div>
            <div className="flex items-start min-h-[2.5rem] md:min-h-[3rem]">
              <div className="space-y-1 md:space-y-1.5 w-full">
                <small className="block text-xs md:text-sm text-muted-foreground font-medium">
                  {"ab " + formatTime(new Date(task.startTime))}
                </small>
                {task.description ? (
                  task.description.length > 60 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CardDescription className="text-xs md:text-sm text-muted-foreground line-clamp-2 cursor-help min-h-[2.5rem]">
                            {task.description}
                          </CardDescription>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="whitespace-pre-wrap break-words">{task.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <CardDescription className="text-xs md:text-sm text-muted-foreground break-words line-clamp-2 min-h-[2.5rem]">
                      {task.description}
                    </CardDescription>
                  )
                ) : (
                  <div className="min-h-[2.5rem]"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 md:space-y-3 pt-2 md:pt-3">
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Teilnehmer
            </span>
            {isFull ? (
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                Voll
              </span>
            ) : isAlmostFull ? (
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                Fast voll
              </span>
            ) : null}
          </div>
          <Progress
            value={progressPercentage}
            aria-label={`${participantsAmount} von ${task.requiredParticipants} Personen`}
            className={`h-2.5 ${isFull
              ? "[&>div]:bg-green-500"
              : progressPercentage >= 67
                ? "[&>div]:bg-green-500"
                : progressPercentage >= 34
                  ? "[&>div]:bg-orange-500"
                  : "[&>div]:bg-red-500"
              }`}
          />
          <div className="flex items-center justify-between">
            <small className="text-xs md:text-sm font-medium text-muted-foreground">
              {participantsAmount} von {task.requiredParticipants} Personen
            </small>
          </div>
        </div>
      </CardContent>

      <CardContent className="mt-auto pt-2 md:pt-3 pb-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 h-9 md:h-10"
            >
              <Users className="h-4 w-4 mr-2 shrink-0" />
              <span className="text-xs md:text-sm truncate">
                Bereits eingetragen ({participantsAmount})
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="border-b pb-3 text-lg">
                Teilnehmer Übersicht
              </DialogTitle>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {isLoggedIn ? (
                  participants.length > 0 ? (
                    <ul className="space-y-2.5">
                      {participants.map((participant) => (
                        <li
                          key={participant.id}
                          className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <span className="font-medium">
                            {participant.groupName
                              ? participant.groupName
                              : participant.user?.name || "-"}
                          </span>
                          {participant.groupSize > 1 && (
                            <span className="text-sm text-muted-foreground ml-3 shrink-0">
                              ({participant.groupSize} Person
                              {participant.groupSize > 1 ? "en" : ""})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Noch keine Teilnehmer eingetragen.
                    </p>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Melde dich an um andere Teilnehmer zu sehen.
                  </p>
                )}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>

      <CardFooter className="pt-3 md:pt-4 lg:pt-5">
        <Button
          asChild={!isFull}
          disabled={isFull}
          className={`whitespace-nowrap disabled:cursor-not-allowed w-full h-10 md:h-11 text-sm md:text-base font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isFull
            ? "disabled:opacity-60"
            : ""
            }`}
        >
          <Link
            href={
              isFull
                ? "#"
                : `/events/${eventId}/shifts/${shiftId}/tasks/${task.id}`
            }
            className="flex items-center justify-center"
          >
            {isFull ? "Vollständig besetzt" : "Zur Aufgabe anmelden"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}