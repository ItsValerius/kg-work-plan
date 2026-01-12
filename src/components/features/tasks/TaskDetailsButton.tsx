"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { TaskDetailsDialog } from "./TaskDetailsDialog";
import { tasks } from "@/db/schema/index";
import { taskParticipants } from "@/db/schema";

type Participant = typeof taskParticipants.$inferSelect & {
    user: { name: string | null; email: string | null } | null;
};

interface TaskDetailsButtonProps {
    task: typeof tasks.$inferSelect;
    participants: Participant[];
    isLoggedIn: boolean;
    isFull: boolean;
    progressPercentage: number;
    progressBarColor: string;
}

export function TaskDetailsButton({
    task,
    participants,
    isLoggedIn,
    isFull,
    progressPercentage,
    progressBarColor,
}: TaskDetailsButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10">
            <TaskDetailsDialog
                task={task}
                participants={participants}
                isLoggedIn={isLoggedIn}
                isFull={isFull}
                progressPercentage={progressPercentage}
                progressBarColor={progressBarColor}
                open={open}
                onOpenChange={setOpen}
                trigger={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        aria-label="Aufgabendetails anzeigen"
                    >
                        <Info className="size-4" />
                    </Button>
                }
            />
        </div>
    );
}
