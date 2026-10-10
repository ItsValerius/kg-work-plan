"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatTime } from "@/lib/datetime";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DataTableColumnHeader } from "./data-table-column-header";
import type { ParticipantsTableFeatures } from "./table-features";

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
export const columns: ColumnDef<ParticipantsTableFeatures, UserTasksResult>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) =>
      row.original.user?.name || <span className="text-muted-foreground">Ohne Namen</span>,
  },
  {
    accessorFn: (row) => row.task.shift.event.name,
    id: "event",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Veranstaltung" />,
  },
  {
    accessorKey: "user.email",
    id: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="E-Mail" />,
  },
  {
    accessorKey: "groupSize",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gruppe" />,
    cell: ({ row }) => {
      const size = row.original.groupSize;
      const name = row.original.groupName;
      if (!name && size === 1) return <span className="text-muted-foreground">allein</span>;
      return `${name ? `„${name}“ · ` : ""}${size}`;
    },
    filterFn: (row, id, value) => {
      const groupSize = row.getValue(id) as number;
      if (value === "1") return groupSize === 1;
      if (value === "2") return groupSize === 2;
      if (value === "3") return groupSize === 3;
      if (value === "4") return groupSize >= 4;
      return true;
    },
  },
  {
    accessorFn: (row) => row.task.name,
    id: "task.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Aufgabe" />,
    cell: ({ row }) => {
      const time = formatTime(new Date(row.original.task.startTime));
      return (
        <span>
          {row.original.task.name} <span className="tabular text-muted-foreground">· {time}</span>
        </span>
      );
    },
  },
  {
    accessorFn: (row) => row.task.shift.name,
    id: "task.shift.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Schicht" />,
  },
];
