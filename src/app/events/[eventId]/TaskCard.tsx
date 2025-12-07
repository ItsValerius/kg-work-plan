import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
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

  return (
    <Card className="flex flex-col">
      <CardHeader className={isAdmin ? "pb-4" : ""}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="font-medium break-words">{task.name}</CardTitle>
            <small className="block mt-1">{"ab " + formatTime(new Date(task.startTime))}</small>
            {task.description.length > 60 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardDescription className="text-sm text-gray-500 mt-2 line-clamp-2 cursor-help">
                      {task.description}
                    </CardDescription>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="whitespace-pre-wrap break-words">{task.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <CardDescription className="text-sm text-gray-500 mt-2 break-words">
                {task.description}
              </CardDescription>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/events/${eventId}/shifts/${shiftId}/tasks/${task.id}/edit`}
                aria-label={`Edit task ${task.name}`}
              >
                <EditButton className="w-fit" />
              </Link>
              <DeleteButton
                className="w-fit"
                id={task.id}
                deleteAction={deleteTask}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Progress
          value={(participantsAmount / task.requiredParticipants) * 100}
          aria-label={`${participantsAmount} von ${task.requiredParticipants} Personen`}
        />
        <small className="text-sm font-medium leading-none">
          {participantsAmount} von {task.requiredParticipants} Personen
        </small>
      </CardContent>

      <CardContent className="mt-auto">
        <Dialog>
          <DialogTrigger>Bereits eingetragen</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="border-b">Übersicht</DialogTitle>

              {isLoggedIn ? (
                <ul className="space-y-1 mt-2">
                  {participants.map((participant) => (
                    <li key={participant.id}>
                      {participant.groupName
                        ? participant.groupName
                        : participant.user?.name || "-"}
                      {participant.groupSize > 1 &&
                        ` (${participant.groupSize})`}
                    </li>
                  ))}
                </ul>
              ) : (
                "Melde dich an um andere Teilnehmer zu sehen."
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>

      <CardFooter>
        <Button
          asChild={!isFull}
          disabled={isFull}
          className="whitespace-nowrap disabled:cursor-not-allowed w-full"
        >
          <Link
            href={
              isFull
                ? "#"
                : `/events/${eventId}/shifts/${shiftId}/tasks/${task.id}`
            }
          >
            {isFull ? "Vollständig besetzt" : "Zur Aufgabe anmelden"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
