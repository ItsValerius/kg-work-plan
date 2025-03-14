"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DataTableColumnHeader } from "./data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const UserTaskSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  createdAt: z.date(),
  createdById: z.string(),
  taskId: z.string(),
  groupName: z.string().nullable(),
  groupSize: z.number(),
  user: z
    .object({
      name: z.string().nullable(),
      email: z.string().nullable(),
    })
    .nullable(),
  task: z.object({
    name: z.string(),
    startTime: z.date(),
    shift: z.object({
      name: z.string(),
      event: z.object({
        name: z.string(),
      }),
    }),
  }),
});

type UserTasksResult = z.infer<typeof UserTaskSchema>;
export const columns: ColumnDef<UserTasksResult>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "user.email",
    id: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "groupName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gruppenname" />
    ),
  },
  {
    accessorKey: "groupSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gruppengröße" />
    ),
  },
  {
    accessorKey: "task.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aufgabe" />
    ),
  },
  {
    accessorKey: "task.startTime",
    id: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Zeit" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("startTime"));
      const formatted = date.toLocaleTimeString("de-DE", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
      });
      return formatted;
    },
  },
  {
    accessorKey: "task.shift.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Schicht" />
    ),
  },
  {
    accessorKey: "task.shift.event.name",
    id: "event",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Veranstaltung" />
    ),
  },
];
