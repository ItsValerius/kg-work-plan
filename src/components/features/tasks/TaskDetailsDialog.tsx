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
        0
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
            <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader className="pb-4 sm:pb-6">
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl pr-8 leading-tight">
                        {task.name}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 sm:space-y-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 sm:size-5 text-muted-foreground shrink-0" />
                            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Zeit
                            </h3>
                        </div>
                        <p className="text-sm sm:text-base font-medium text-foreground">
                            ab {formatTime(new Date(task.startTime))}
                        </p>
                    </div>

                    {task.description && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 sm:size-5 text-muted-foreground shrink-0" />
                                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                    Beschreibung
                                </h3>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
                                {task.description}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4 sm:space-y-5">
                        <div className="flex items-center gap-2">
                            <Users className="size-4 sm:size-5 text-muted-foreground shrink-0" />
                            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Teilnehmer
                            </h3>
                        </div>
                        <div className="space-y-4 sm:space-y-5">
                            <div className="space-y-3.5 p-4 sm:p-5 rounded-lg border bg-muted/40 dark:bg-muted/20">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Status
                                    </span>
                                    {isFull ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-700 dark:bg-green-400"></span>
                                            Voll
                                        </span>
                                    ) : (
                                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground text-right">
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
                                    <small className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        {participantsAmount} von {task.requiredParticipants} Personen
                                    </small>
                                </div>
                            </div>

                            {isLoggedIn && participants.length > 0 && (
                                <div className="pt-4 sm:pt-5 space-y-3 sm:space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="size-4 sm:size-5 text-muted-foreground shrink-0" />
                                        <span className="text-sm sm:text-base font-semibold text-foreground">
                                            Bereits eingetragen ({participantsAmount})
                                        </span>
                                    </div>
                                    <div className="max-h-[40vh] sm:max-h-[45vh] overflow-y-auto pr-1 sm:pr-2 space-y-2 sm:space-y-2.5">
                                        {participants.map((participant) => {
                                            const isGroup = participant.groupSize > 1;
                                            const displayName = participant.groupName
                                                ? participant.groupName
                                                : participant.user?.name || "Unbekannt";

                                            return (
                                                <div
                                                    key={participant.id}
                                                    className={cn(
                                                        "flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-colors",
                                                        "hover:bg-accent/50 hover:border-accent-foreground/20",
                                                        "bg-card"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm sm:text-base truncate">
                                                                {displayName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isGroup && (
                                                        <div className="flex items-center gap-1.5 shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary">
                                                            <UserCheck className="size-3.5 sm:size-4" />
                                                            <span className="text-xs sm:text-sm font-medium">
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
                                <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
                                    <div className="rounded-full bg-muted p-3 sm:p-4 mb-3 sm:mb-4">
                                        <Users className="size-6 sm:size-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                                        Noch keine Teilnehmer
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                                        Noch keine Teilnehmer für diese Aufgabe eingetragen.
                                    </p>
                                </div>
                            )}

                            {!isLoggedIn && (
                                <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
                                    <div className="rounded-full bg-muted p-3 sm:p-4 mb-3 sm:mb-4">
                                        <UserCheck className="size-6 sm:size-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                                        Anmeldung erforderlich
                                    </h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
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
