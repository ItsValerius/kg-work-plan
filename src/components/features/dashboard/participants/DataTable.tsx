"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  events: (typeof events.$inferSelect)[];
  shifts?: Array<{ id: string; name: string; eventName: string }>;
  tasks?: Array<{ id: string; name: string; shiftName: string }>;
  onDeleteRows?: (selectedRowIds: string[]) => void;
}

interface Identifiable {
  id: string; // or whatever type your IDs are
}

export function DataTable<TData extends Identifiable, TValue>({
  columns,
  data,
  events,
  shifts = [],
  tasks = [],
  onDeleteRows,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectResetKey, setSelectResetKey] = React.useState(0);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow) => originalRow.id,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const rowData = row.original as TData & {
        user?: { name?: string | null; email?: string | null } | null;
        groupName?: string | null;
        task?: {
          name?: string;
          shift?: { name?: string; event?: { name?: string } };
        };
      };

      // Search in nested fields
      const searchableFields = [
        rowData.user?.name || "",
        rowData.user?.email || "",
        rowData.groupName || "",
        rowData.task?.name || "",
        rowData.task?.shift?.name || "",
        rowData.task?.shift?.event?.name || "",
      ];

      return searchableFields.some((field) =>
        String(field).toLowerCase().includes(searchValue)
      );
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
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

  const handleExport = () => {
    const filteredData = table.getFilteredRowModel().rows.map((row) => {
      const rowData = row.original as TData & {
        user?: { name?: string | null; email?: string | null } | null;
        groupName?: string | null;
        groupSize?: number;
        task?: {
          name?: string;
          startTime?: Date;
          shift?: { name?: string; event?: { name?: string } };
        };
      };
      return {
        Name: rowData.user?.name || "",
        Email: rowData.user?.email || "",
        "Gruppenname": rowData.groupName || "",
        "Gruppengröße": rowData.groupSize || "",
        Aufgabe: rowData.task?.name || "",
        Zeit: rowData.task?.startTime
          ? new Date(rowData.task.startTime).toLocaleString("de-DE")
          : "",
        Schicht: rowData.task?.shift?.name || "",
        Veranstaltung: rowData.task?.shift?.event?.name || "",
      };
    });

    const headers = Object.keys(filteredData[0] || {});
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        headers.map((header) => `"${row[header as keyof typeof row] || ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `dashboard-export-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters =
    !!table.getColumn("event")?.getFilterValue() ||
    !!table.getColumn("task.shift.name")?.getFilterValue() ||
    !!table.getColumn("task.name")?.getFilterValue() ||
    !!table.getColumn("groupSize")?.getFilterValue() ||
    globalFilter;

  const clearAllFilters = () => {
    // Explicitly clear each column filter
    table.getColumn("event")?.setFilterValue(undefined);
    table.getColumn("task.shift.name")?.setFilterValue(undefined);
    table.getColumn("task.name")?.setFilterValue(undefined);
    table.getColumn("groupSize")?.setFilterValue(undefined);
    setColumnFilters([]);
    setGlobalFilter("");
    // Force Select components to remount by incrementing the key
    setSelectResetKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="global-search">Suche</Label>
            <Input
              id="global-search"
              placeholder="Nach Name, Email, Gruppe suchen..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="w-[180px]">
            <Label>Veranstaltung</Label>
            <Select
              key={`event-${selectResetKey}`}
              value={
                (table.getColumn("event")?.getFilterValue() as string) || undefined
              }
              onValueChange={(value) =>
                table.getColumn("event")?.setFilterValue(value || undefined)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Alle Veranstaltungen" />
              </SelectTrigger>
              <SelectContent position="popper" className="w-[180px]">
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.name}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {shifts.length > 0 && (
            <div className="w-[180px]">
              <Label>Schicht</Label>
              <Select
                key={`shift-${selectResetKey}`}
                value={
                  (table.getColumn("task.shift.name")?.getFilterValue() as string) || undefined
                }
                onValueChange={(value) =>
                  table.getColumn("task.shift.name")?.setFilterValue(value || undefined)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alle Schichten" />
                </SelectTrigger>
                <SelectContent position="popper" className="w-[180px]">
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.name}>
                      {shift.name} ({shift.eventName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {tasks.length > 0 && (
            <div className="w-[180px]">
              <Label>Aufgabe</Label>
              <Select
                key={`task-${selectResetKey}`}
                value={
                  (table.getColumn("task.name")?.getFilterValue() as string) || undefined
                }
                onValueChange={(value) =>
                  table.getColumn("task.name")?.setFilterValue(value || undefined)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alle Aufgaben" />
                </SelectTrigger>
                <SelectContent position="popper" className="w-[180px]">
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.name}>
                      {task.name} ({task.shiftName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="w-[150px]">
            <Label>Gruppengröße</Label>
            <Select
              key={`groupSize-${selectResetKey}`}
              value={
                (table.getColumn("groupSize")?.getFilterValue() as string) || undefined
              }
              onValueChange={(value) =>
                table.getColumn("groupSize")?.setFilterValue(value || undefined)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Alle Größen" />
              </SelectTrigger>
              <SelectContent position="popper" className="w-[150px]">
                <SelectItem value="1">1 Person</SelectItem>
                <SelectItem value="2">2 Personen</SelectItem>
                <SelectItem value="3">3 Personen</SelectItem>
                <SelectItem value="4">4+ Personen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <Button variant="secondary" onClick={clearAllFilters}>
              Filter zurücksetzen
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleExport}
            className="ml-auto"
            disabled={table.getFilteredRowModel().rows.length === 0}
          >
            <Download className="mr-2 size-4" />
            CSV exportieren
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={Object.keys(rowSelection).length === 0}
          >
            Ausgewählte löschen ({Object.keys(rowSelection).length})
          </Button>
        </div>
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
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} von{" "}
          {table.getFilteredRowModel().rows.length} Zeile(n) ausgewählt.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Zeilen pro Seite</p>
            <div className="w-[70px]">
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent position="popper" side="top" className="w-[70px]">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Seite {table.getState().pagination.pageIndex + 1} von{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Zur ersten Seite</span>
              <ChevronLeft className="size-4" />
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Zur vorherigen Seite</span>
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Zur nächsten Seite</span>
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Zur letzten Seite</span>
              <ChevronRight className="size-4" />
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
