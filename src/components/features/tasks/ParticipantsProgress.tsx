"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { getProgressBarColor } from "./utils";

interface ParticipantsProgressProps {
    participantsAmount: number;
    requiredParticipants: number;
    progressPercentage: number;
    isFull: boolean;
    isAlmostFull: boolean;
}

function renderStatusBadge(isFull: boolean, isAlmostFull: boolean) {
    if (isFull) {
        return (
            <span className="text-xs font-semibold text-green-800 dark:text-green-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-800 dark:text-green-400"></span>
                Voll
            </span>
        );
    }
    if (isAlmostFull) {
        return (
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                Fast voll
            </span>
        );
    }
    return null;
}

export function ParticipantsProgress({
    participantsAmount,
    requiredParticipants,
    progressPercentage,
    isFull,
    isAlmostFull,
}: ParticipantsProgressProps) {
    const progressBarColor = getProgressBarColor(progressPercentage, isFull);

    return (
        <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Teilnehmer
                </span>
                {renderStatusBadge(isFull, isAlmostFull)}
            </div>
            <div className="space-y-2">
                <Progress
                    value={progressPercentage}
                    aria-label={`${participantsAmount} von ${requiredParticipants} Personen`}
                    className={`h-2.5 ${progressBarColor}`}
                />
                <div className="flex items-center justify-between gap-2">
                    <small className="text-xs md:text-sm font-medium text-muted-foreground">
                        {participantsAmount} von {requiredParticipants} Personen
                    </small>
                </div>
            </div>
        </div>
    );
}
