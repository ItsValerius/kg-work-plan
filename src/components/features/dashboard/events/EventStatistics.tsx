"use client";

import { Card } from "@/components/ui/card";
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
import { Users, AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Search, ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventStat } from "@/domains/dashboard/types";

interface EventStatisticsProps {
  events: EventStat[];
}

type SortOption = "name" | "completion" | "participants";

export function EventStatistics({ events }: EventStatisticsProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [expandedShifts, setExpandedShifts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const toggleEvent = (eventId: string) => {
    const newSet = new Set(expandedEvents);
    if (newSet.has(eventId)) {
      newSet.delete(eventId);
    } else {
      newSet.add(eventId);
    }
    setExpandedEvents(newSet);
  };

  const toggleShift = (shiftId: string) => {
    const newSet = new Set(expandedShifts);
    if (newSet.has(shiftId)) {
      newSet.delete(shiftId);
    } else {
      newSet.add(shiftId);
    }
    setExpandedShifts(newSet);
  };

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort events
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.eventName.localeCompare(b.eventName);
        case "completion": {
          const aCompletion = a.requiredParticipants > 0
            ? a.totalParticipants / a.requiredParticipants
            : 0;
          const bCompletion = b.requiredParticipants > 0
            ? b.totalParticipants / b.requiredParticipants
            : 0;
          return bCompletion - aCompletion;
        }
        case "participants":
          return b.totalParticipants - a.totalParticipants;
        default:
          return 0;
      }
    });

    return sorted;
  }, [events, searchQuery, sortBy]);

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Veranstaltungen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sortieren nach" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-[200px]">
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="completion">Vollständigkeit</SelectItem>
              <SelectItem value="participants">Teilnehmer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedEvents.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? "Keine Veranstaltungen gefunden." : "Keine Veranstaltungen vorhanden."}
          </p>
        </Card>
      ) : (
        filteredAndSortedEvents.map((event) => {
          const isComplete = event.totalParticipants >= event.requiredParticipants;
          const isExpanded = expandedEvents.has(event.eventId);
          const completionPercentage = event.requiredParticipants > 0
            ? Math.round((event.totalParticipants / event.requiredParticipants) * 100)
            : 0;

          return (
            <Card key={event.eventId} className="overflow-hidden">
              <div
                className="flex items-center justify-between cursor-pointer p-4 hover:bg-muted/50 transition-colors"
                onClick={() => toggleEvent(event.eventId)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                  <h3 className="font-semibold text-lg truncate">{event.eventName}</h3>
                  {isComplete ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500 text-white text-xs font-medium flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                      Vollständig
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-medium flex-shrink-0">
                      <AlertCircle className="h-3 w-3" />
                      {event.requiredParticipants - event.totalParticipants} mehr
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.totalParticipants} / {event.requiredParticipants}
                  </span>
                  <span className="hidden sm:inline text-xs">
                    {completionPercentage}%
                  </span>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href={`/events/${event.eventId}`}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Zur Veranstaltung</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t pt-4">
                  {event.shifts.map((shift) => {
                    const shiftComplete = shift.totalParticipants >= shift.requiredParticipants;
                    const isShiftExpanded = expandedShifts.has(shift.shiftId);
                    const shiftCompletionPercentage = shift.requiredParticipants > 0
                      ? Math.round((shift.totalParticipants / shift.requiredParticipants) * 100)
                      : 0;

                    return (
                      <Card key={shift.shiftId} className="bg-muted/30">
                        <div
                          className="flex items-center justify-between cursor-pointer p-3 hover:bg-muted/50 transition-colors rounded-t-lg"
                          onClick={() => toggleShift(shift.shiftId)}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {isShiftExpanded ? (
                              <ChevronDown className="h-3 w-3 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-3 w-3 flex-shrink-0" />
                            )}
                            <span className="font-medium truncate">{shift.shiftName}</span>
                            {shiftComplete ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-500 text-white text-xs font-medium flex-shrink-0">
                                Vollständig
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-destructive text-destructive-foreground text-xs font-medium flex-shrink-0">
                                {shift.requiredParticipants - shift.totalParticipants} mehr
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-sm text-muted-foreground">
                              {shift.totalParticipants} / {shift.requiredParticipants}
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {shiftCompletionPercentage}%
                            </span>
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link href={`/events/${event.eventId}#shift-${shift.shiftId}`}>
                                <ExternalLink className="h-3 w-3" />
                                <span className="sr-only">Zur Schicht</span>
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {isShiftExpanded && (
                          <div className="px-3 pb-3">
                            <div className="rounded-md border bg-background">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Aufgabe</TableHead>
                                    <TableHead>Zeit</TableHead>
                                    <TableHead>Teilnehmer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {shift.tasks.map((task) => {
                                    const taskComplete = task.currentParticipants >= task.requiredParticipants;
                                    const taskTime = new Date(task.startTime).toLocaleTimeString("de-DE", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    });
                                    const taskCompletionPercentage = task.requiredParticipants > 0
                                      ? Math.round((task.currentParticipants / task.requiredParticipants) * 100)
                                      : 0;

                                    return (
                                      <TableRow key={task.taskId}>
                                        <TableCell className="font-medium">{task.taskName}</TableCell>
                                        <TableCell>{taskTime}</TableCell>
                                        <TableCell>
                                          {task.currentParticipants} / {task.requiredParticipants}
                                          <span className="text-xs text-muted-foreground ml-2">
                                            ({taskCompletionPercentage}%)
                                          </span>
                                        </TableCell>
                                        <TableCell>
                                          {taskComplete ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-500 text-white text-xs font-medium">
                                              Vollständig
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-medium">
                                              {task.requiredParticipants - task.currentParticipants} mehr
                                            </span>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                          >
                                            <Link href={`/events/${event.eventId}/shifts/${shift.shiftId}/tasks/${task.taskId}`}>
                                              <ExternalLink className="h-3 w-3" />
                                              <span className="sr-only">Zur Aufgabe</span>
                                            </Link>
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
