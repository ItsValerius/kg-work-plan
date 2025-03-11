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
      <CardHeader>
        <CardTitle className="font-medium">{task.name}</CardTitle>
        {isAdmin && (
          <div className="self-end absolute flex gap-2">
            <DeleteButton
              className="w-fit"
              id={task.id}
              deleteAction={deleteTask}
            />
            <Link
              href={`/events/${eventId}/shifts/${shiftId}/tasks/${task.id}/edit`}
              aria-label={`Edit task ${task.name}`}
            >
              <EditButton className="w-fit" />
            </Link>
          </div>
        )}
        <small>{"ab " + formatTime(new Date(task.startTime))}</small>
        <CardDescription className="text-sm text-gray-500">
          {task.description}
        </CardDescription>
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
          className="text-wrap disabled:cursor-not-allowed"
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
