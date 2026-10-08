"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatTime } from "@/lib/datetime";
import { Users, UserCheck, Info, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tasks } from "@/db/schema/index";
import { taskParticipants } from "@/db/schema";
import { cn } from "@/lib/utils";

type Participant = typeof taskParticipants.$inferSelect & {
  user: { name: string | null; email: string | null } | null;
};

interface TaskDetailsDialogProps {
  task: typeof tasks.$inferSelect;
  participants: Participant[];
  isLoggedIn: boolean;
  isFull: boolean;
  progressPercentage: number;
  progressBarColor: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TaskDetailsDialog({
  task,
  participants,
  isLoggedIn,
  isFull,
  progressPercentage,
  progressBarColor,
  trigger,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) {
  const participantsAmount = participants.reduce(
    (accumulator, participant) => accumulator + participant.groupSize,
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && open === undefined && onOpenChange === undefined && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            aria-label="Aufgabendetails anzeigen"
          >
            <Info className="size-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto p-4 sm:max-h-[85vh] sm:w-full sm:p-6">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="pr-8 text-lg leading-tight sm:text-xl md:text-2xl">
            {task.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-muted-foreground sm:size-5" />
              <h3 className="text-[15px] font-semibold text-foreground">Zeit</h3>
            </div>
            <p className="text-sm font-medium text-foreground sm:text-base">
              ab {formatTime(new Date(task.startTime))}
            </p>
          </div>

          {task.description && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 shrink-0 text-muted-foreground sm:size-5" />
                <h3 className="text-[15px] font-semibold text-foreground">Beschreibung</h3>
              </div>
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-muted-foreground sm:text-base">
                {task.description}
              </p>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2">
              <Users className="size-4 shrink-0 text-muted-foreground sm:size-5" />
              <h3 className="text-[15px] font-semibold text-foreground">Teilnehmer</h3>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-3.5 rounded-lg border bg-muted/40 p-4 sm:p-5 dark:bg-muted/20">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold text-muted-foreground">Status</span>
                  {isFull ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 sm:text-sm dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-700 dark:bg-green-400"></span>
                      Voll
                    </span>
                  ) : (
                    <span className="text-right text-xs font-semibold text-muted-foreground sm:text-sm">
                      {task.requiredParticipants - participantsAmount} weitere
                      {task.requiredParticipants - participantsAmount === 1
                        ? " Person"
                        : " Personen"}{" "}
                      benötigt
                    </span>
                  )}
                </div>
                <Progress
                  value={progressPercentage}
                  aria-label={`${participantsAmount} von ${task.requiredParticipants} Personen`}
                  className={`h-2.5 sm:h-3 ${progressBarColor}`}
                />
                <div className="flex items-center justify-between pt-0.5">
                  <small className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {participantsAmount} von {task.requiredParticipants} Personen
                  </small>
                </div>
              </div>

              {isLoggedIn && participants.length > 0 && (
                <div className="space-y-3 pt-4 sm:space-y-4 sm:pt-5">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 shrink-0 text-muted-foreground sm:size-5" />
                    <span className="text-sm font-semibold text-foreground sm:text-base">
                      Bereits eingetragen ({participantsAmount})
                    </span>
                  </div>
                  <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1 sm:max-h-[45vh] sm:space-y-2.5 sm:pr-2">
                    {participants.map((participant) => {
                      const isGroup = participant.groupSize > 1;
                      const displayName = participant.groupName
                        ? participant.groupName
                        : participant.user?.name || "Unbekannt";

                      return (
                        <div
                          key={participant.id}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors sm:gap-4 sm:p-4",
                            "hover:border-accent-foreground/20 hover:bg-accent/50",
                            "bg-card",
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium sm:text-base">
                                {displayName}
                              </p>
                            </div>
                          </div>
                          {isGroup && (
                            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary sm:px-3 sm:py-1.5">
                              <UserCheck className="size-3.5 sm:size-4" />
                              <span className="text-xs font-medium sm:text-sm">
                                {participant.groupSize}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isLoggedIn && participants.length === 0 && (
                <div className="flex flex-col items-center justify-center px-4 py-8 text-center sm:py-12">
                  <div className="mb-3 rounded-full bg-muted p-3 sm:mb-4 sm:p-4">
                    <Users className="size-6 text-muted-foreground sm:size-8" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold sm:mb-2 sm:text-base">
                    Noch keine Teilnehmer
                  </h3>
                  <p className="max-w-sm text-xs text-muted-foreground sm:text-sm">
                    Noch keine Teilnehmer für diese Aufgabe eingetragen.
                  </p>
                </div>
              )}

              {!isLoggedIn && (
                <div className="flex flex-col items-center justify-center px-4 py-8 text-center sm:py-12">
                  <div className="mb-3 rounded-full bg-muted p-3 sm:mb-4 sm:p-4">
                    <UserCheck className="size-6 text-muted-foreground sm:size-8" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold sm:mb-2 sm:text-base">
                    Anmeldung erforderlich
                  </h3>
                  <p className="max-w-sm text-xs text-muted-foreground sm:text-sm">
                    Melde dich an, um andere Teilnehmer zu sehen.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
