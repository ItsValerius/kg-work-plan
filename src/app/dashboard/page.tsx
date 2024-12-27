import BackButton from "@/components/BackButton";
import db from "@/db";
import { events } from "@/db/schema";
import { isAdmin } from "@/lib/auth/utils";
import { gt } from "drizzle-orm";
import { redirect } from "next/navigation";
import { removeUserFromTaskAction } from "./actions";
import { columns } from "./columns";
import { DataTable } from "./DataTable";

const DashboardPage = async () => {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) return redirect("/");
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
  const futureEvents = await db.query.events.findMany({
    where: gt(events.endDate, new Date()),
  });

  return (
    <div className="container mx-auto py-8">
      <BackButton />
      <DataTable
        columns={columns}
        data={userTasks}
        events={futureEvents}
        onDeleteRows={removeUserFromTaskAction}
      />
    </div>
  );
};

export default DashboardPage;
