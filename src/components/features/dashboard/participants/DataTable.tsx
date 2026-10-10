"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  RowData,
  RowSelectionState,
  SortingState,
  useTable,
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
import type { ShiftFilterOption, TaskFilterOption } from "@/domains/dashboard/types";
import { changePlanFilter } from "@/domains/dashboard/filters";
import React from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { participantsTableFeatures, type ParticipantsTableFeatures } from "./table-features";
import { downloadCsv } from "@/lib/csv";
import { berlinToday, formatDateTime } from "@/lib/datetime";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<ParticipantsTableFeatures, TData>[];
  data: TData[];
  events: (typeof events.$inferSelect)[];
  shifts?: ShiftFilterOption[];
  tasks?: TaskFilterOption[];
  onDeleteRows?: (selectedRowIds: string[]) => void | Promise<void>;
}

const GROUP_SIZE_ITEMS = [
  { value: "1", label: "1 Person" },
  { value: "2", label: "2 Personen" },
  { value: "3", label: "3 Personen" },
  { value: "4", label: "4+ Personen" },
];

type Identifiable = {
  id: string; // or whatever type your IDs are
};

export function DataTable<TData extends Identifiable>({
  columns,
  data,
  events,
  shifts = [],
  tasks = [],
  onDeleteRows,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectResetKey, setSelectResetKey] = React.useState(0);

  const table = useTable({
    features: participantsTableFeatures,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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

      return searchableFields.some((field) => String(field).toLowerCase().includes(searchValue));
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [isRemoving, startRemoving] = React.useTransition();
  const selectedCount = Object.keys(rowSelection).length;

  const handleDelete = () => {
    if (!onDeleteRows) return;
    const selectedRowIds = Object.keys(rowSelection).filter((rowId) => rowSelection[rowId]);
    startRemoving(async () => {
      try {
        await onDeleteRows(selectedRowIds);
        toast.success(
          selectedRowIds.length === 1
            ? "1 Eintrag ausgetragen."
            : `${selectedRowIds.length} Einträge ausgetragen.`,
        );
        setRowSelection({});
        setConfirmOpen(false);
      } catch {
        toast.error("Austragen hat nicht geklappt. Bitte versuche es noch einmal.");
      }
    });
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
        Gruppenname: rowData.groupName || "",
        Gruppengröße: rowData.groupSize || "",
        Aufgabe: rowData.task?.name || "",
        Zeit: rowData.task?.startTime ? formatDateTime(new Date(rowData.task.startTime)) : "",
        Schicht: rowData.task?.shift?.name || "",
        Veranstaltung: rowData.task?.shift?.event?.name || "",
      };
    });

    const headers = Object.keys(filteredData[0] || {});
    downloadCsv(
      `dashboard-export-${berlinToday()}.csv`,
      headers,
      filteredData.map((row) => headers.map((header) => row[header as keyof typeof row] ?? "")),
    );
  };

  // Event → shift → task filters hold ids; options narrow to the selected parent.
  const filterValue = (id: string) =>
    columnFilters.find((filter) => filter.id === id)?.value as string | undefined;
  const eventId = filterValue("event");
  const shiftId = filterValue("task.shift.name");
  const taskId = filterValue("task.name");
  const selectPlan = (level: "event" | "shift" | "task") => (id: string | null) => {
    if (!id) return;
    const next = changePlanFilter({ eventId, shiftId, taskId }, level, id, shifts, tasks);
    table.setColumnFilters((prev) => [
      ...prev.filter((f) => !["event", "task.shift.name", "task.name"].includes(f.id)),
      ...(next.eventId ? [{ id: "event", value: next.eventId }] : []),
      ...(next.shiftId ? [{ id: "task.shift.name", value: next.shiftId }] : []),
      ...(next.taskId ? [{ id: "task.name", value: next.taskId }] : []),
    ]);
  };
  const eventItems = events.map((event) => ({ value: event.id, label: event.name }));
  const shiftItems = shifts
    .filter((shift) => !eventId || shift.eventId === eventId)
    .map((shift) => ({
      value: shift.id,
      label: eventId ? shift.name : `${shift.name} (${shift.eventName})`,
    }));
  const taskItems = tasks
    .filter((task) => (shiftId ? task.shiftId === shiftId : !eventId || task.eventId === eventId))
    .map((task) => ({
      value: task.id,
      label: shiftId ? task.name : `${task.name} (${task.shiftName})`,
    }));

  const hasActiveFilters = columnFilters.length > 0 || globalFilter;

  const clearAllFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
    // Force Select components to remount by incrementing the key
    setSelectResetKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {/* Search - full width on mobile */}
        <div className="w-full">
          <Label htmlFor="global-search">Suche</Label>
          <Input
            id="global-search"
            placeholder="Nach Name, Email, Gruppe suchen..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filter grid - responsive */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="w-full">
            <Label>Veranstaltung</Label>
            <Select
              items={eventItems}
              key={`event-${selectResetKey}`}
              value={eventId ?? null}
              onValueChange={selectPlan("event")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Alle Veranstaltungen" />
              </SelectTrigger>
              <SelectContent>
                {eventItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {shifts.length > 0 && (
            <div className="w-full">
              <Label>Schicht</Label>
              <Select
                items={shiftItems}
                key={`shift-${selectResetKey}`}
                value={shiftId ?? null}
                onValueChange={selectPlan("shift")}
                disabled={shiftItems.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alle Schichten" />
                </SelectTrigger>
                <SelectContent>
                  {shiftItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {tasks.length > 0 && (
            <div className="w-full">
              <Label>Aufgabe</Label>
              <Select
                items={taskItems}
                key={`task-${selectResetKey}`}
                value={taskId ?? null}
                onValueChange={selectPlan("task")}
                disabled={taskItems.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alle Aufgaben" />
                </SelectTrigger>
                <SelectContent>
                  {taskItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="w-full">
            <Label>Gruppengröße</Label>
            <Select
              items={GROUP_SIZE_ITEMS}
              key={`groupSize-${selectResetKey}`}
              value={(table.getColumn("groupSize")?.getFilterValue() as string) ?? null}
              onValueChange={(value) =>
                table.getColumn("groupSize")?.setFilterValue(value || undefined)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Alle Größen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Person</SelectItem>
                <SelectItem value="2">2 Personen</SelectItem>
                <SelectItem value="3">3 Personen</SelectItem>
                <SelectItem value="4">4+ Personen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action buttons - stack on mobile */}
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {hasActiveFilters && (
            <Button variant="secondary" onClick={clearAllFilters} className="w-full sm:w-auto">
              Filter zurücksetzen
            </Button>
          )}
          <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              onClick={handleExport}
              className="w-full sm:w-auto"
              disabled={table.getFilteredRowModel().rows.length === 0}
            >
              <Download className="mr-2 size-4" />
              <span className="sm:inline">CSV exportieren</span>
            </Button>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={selectedCount === 0}
                  >
                    Austragen ({selectedCount})
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {selectedCount === 1
                      ? "1 Eintrag austragen?"
                      : `${selectedCount} Einträge austragen?`}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Die Plätze werden wieder frei. Sag den Personen am besten kurz Bescheid.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isRemoving} autoFocus>
                    Behalten
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    disabled={isRemoving}
                    className="bg-danger text-white hover:bg-destructive"
                  >
                    {isRemoving ? "Wird ausgetragen …" : "Ja, austragen"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      {/* Table with horizontal scroll on mobile */}
      <div className="overflow-x-auto border-t-2 border-foreground/80">
        <Table className="min-w-[640px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Keine Anmeldungen.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - mobile-optimized */}
      <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center text-sm text-muted-foreground sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length} von{" "}
          {table.getFilteredRowModel().rows.length} ausgewählt
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium whitespace-nowrap">Zeilen</p>
            <div className="w-[84px]">
              <Select
                value={`${table.state.pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={table.state.pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top" className="w-[84px]">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium whitespace-nowrap">
              {table.state.pagination.pageIndex + 1} / {table.getPageCount()}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="hidden sm:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Zur ersten Seite</span>
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Zur vorherigen Seite</span>
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Zur nächsten Seite</span>
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden sm:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Zur letzten Seite</span>
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
