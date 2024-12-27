"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { events } from "@/db/schema";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  events: (typeof events.$inferSelect)[];
  onDeleteRows?: (selectedRowIds: string[]) => void; // New prop
}

interface Identifiable {
  id: string; // or whatever type your IDs are
}

export function DataTable<TData extends Identifiable, TValue>({
  columns,
  data,
  events,
  onDeleteRows,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow) => originalRow.id,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const handleDelete = () => {
    if (onDeleteRows) {
      const selectedRowIds = Object.keys(rowSelection).filter(
        (rowId) => rowSelection[rowId]
      );
      onDeleteRows(selectedRowIds);
    }
  };

  return (
    <div>
      <div className="flex items-center py-4 gap-1">
        <div>
          <Label>Filter</Label>
          <Select
            value={(table.getColumn("event")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("event")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Veranstaltungen" />
            </SelectTrigger>

            <SelectContent>
              {events.map((event) => {
                return (
                  <SelectItem key={event.id} value={event.name}>
                    {event.name}{" "}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {!!table.getColumn("event")?.getFilterValue() && (
          <Button
            variant="secondary"
            className="self-end"
            onClick={() => table.getColumn("event")?.setFilterValue("")}
          >
            Zurücksetzen
          </Button>
        )}
        <Button
          variant="destructive"
          className="ml-auto"
          onClick={handleDelete}
          disabled={Object.keys(rowSelection).length === 0} // Disable if no rows selected
        >
          Ausgewählte löschen
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Keine Anmeldungen.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
