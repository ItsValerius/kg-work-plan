import { auth } from "@/auth";
import RemoveUserFromTaskButton from "@/components/RemoveUserFromTaskButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db";
import { taskParticipants, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const MeineAufgabenPage = async () => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/signin");

  const userTasks = await db
    .select({
      id: tasks.id,
      name: tasks.name,
      description: tasks.description,
      shifts: tasks.shiftId,
    })
    .from(taskParticipants)
    .leftJoin(tasks, eq(taskParticipants.taskId, tasks.id))
    .where(eq(taskParticipants.userId, session.user.id));

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between mb-6 flex-col gap-2">
        <Button asChild variant="outline" className="w-fit">
          <Link href="/events">
            {" "}
            <ArrowLeft />
            Zurück
          </Link>
        </Button>
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Meine Aufgaben
          </h1>
          <small className="text-sm font-medium leading-none">
            Für {userTasks.length} Aufgabe{userTasks.length !== 1 ? "n" : ""}{" "}
            eingetragen
          </small>
        </div>
      </div>

      <div className="grid gap-4">
        {userTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-semibold">{task.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {task.description && (
                  <p className="text-gray-600">{task.description}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <RemoveUserFromTaskButton taskId={task.id} />
              <Button asChild variant="destructive"></Button>
            </CardFooter>
          </Card>
        ))}

        {userTasks.length === 0 && (
          <Card className="bg-gray-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 text-center">
                Noch keine Aufgaben übernommen
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MeineAufgabenPage;
