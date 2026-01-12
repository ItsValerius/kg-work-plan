import RemoveUserFromTaskButton from "@/components/shared/buttons/RemoveUserFromTaskButton";
import { EditGroupDialog } from "@/components/shared/dialogs/EditGroupDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthenticatedUser } from "@/lib/auth/utils";
import Link from "next/link";
import { getUserTasks } from "@/domains/tasks/queries";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meine Aufgaben",
};

const MeineAufgabenPage = async () => {
  const user = await getAuthenticatedUser();
  const userId = user.id;

  const userTasks = await getUserTasks(userId);

  return (
    <PageContainer>
      <div className="mb-6 md:mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Meine Aufgaben
        </h1>
        <small className="text-sm font-medium leading-none">
          Für {userTasks.length} Aufgabe{userTasks.length !== 1 ? "n" : ""}{" "}
          eingetragen
        </small>
      </div>

      <div className="grid gap-4">
        {userTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold leading-none tracking-tight">
                  {task.name}
                </h2>
              </CardTitle>
              <CardDescription>
                <small className="text-sm font-medium leading-none">
                  {task.shiftDate?.toLocaleDateString("de-DE", {
                    timeZone: "Europe/Berlin",
                  }) +
                    ", ab " +
                    task.startTime?.toLocaleTimeString("de-DE", {
                      timeZone: "Europe/Berlin",
                      hour: "numeric",
                      minute: "numeric",
                    }) +
                    "Uhr"}
                </small>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <p>{task?.description}</p>
                {(task.groupName || (task.groupSize !== undefined && task.groupSize !== null && task.groupSize > 1)) && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      {task.groupName && (
                        <div>
                          <span className="text-muted-foreground">Gruppe: </span>
                          <span className="font-medium">{task.groupName}</span>
                        </div>
                      )}
                      {task.groupSize !== undefined && task.groupSize !== null && task.groupSize > 1 && (
                        <div>
                          <span className="text-muted-foreground">
                            Gruppengröße:{" "}
                          </span>
                          <span className="font-medium">
                            {task.groupSize} Person
                            {task.groupSize !== 1 ? "en" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <EditGroupDialog
                participantId={task.participantId}
                currentGroupName={task.groupName}
                currentGroupSize={task.groupSize ?? 1}
              />
              <RemoveUserFromTaskButton taskId={task.id} />
            </CardFooter>
          </Card>
        ))}

        {userTasks.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-4">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-muted p-4">
                  <svg
                    className="h-8 w-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Noch keine Aufgaben übernommen</h2>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Du hast dich noch für keine Aufgaben angemeldet. Schau dir die
                    Veranstaltungen an, um Aufgaben zu finden, bei denen du helfen kannst.
                  </p>
                </div>
                <Button asChild className="mt-2">
                  <Link href="/events">Veranstaltungen ansehen</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default MeineAufgabenPage;
