import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./DataTable";
import db from "@/db";
import { columns } from "./columns";
import BackButton from "@/components/BackButton";
import { gt } from "drizzle-orm";
import { events } from "@/db/schema";

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
      <DataTable columns={columns} data={userTasks} events={futureEvents} />
    </div>
  );
};

export default DashboardPage;
