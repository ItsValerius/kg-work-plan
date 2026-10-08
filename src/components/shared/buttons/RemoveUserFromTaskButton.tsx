"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
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
import { removeUserFromTask } from "@/server/actions/users";
import { toast } from "sonner";

interface RemoveUserFromTaskButtonProps {
  taskId: string | null;
  taskName?: string;
}

const RemoveUserFromTaskButton = ({ taskId, taskName }: RemoveUserFromTaskButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!taskId) {
    return null;
  }

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await removeUserFromTask(taskId);
        toast.success(taskName ? `Du bist bei „${taskName}“ ausgetragen.` : "Du bist ausgetragen.");
        setOpen(false);
      } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
          toast.error("Du hast keine Berechtigung für diese Aktion.");
        } else {
          toast.error("Das Austragen hat nicht geklappt. Bitte versuche es noch einmal.");
        }
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="px-3 text-destructive hover:bg-destructive-surface hover:text-destructive">
          Austragen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wirklich austragen?</AlertDialogTitle>
          <AlertDialogDescription>
            {taskName
              ? `Dein Platz bei „${taskName}“ wird wieder frei.`
              : "Dein Platz wird wieder frei."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} autoFocus>
            Behalten
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
            disabled={isPending}
            className="bg-danger text-white hover:bg-destructive"
          >
            {isPending ? "Wird ausgetragen …" : "Ja, austragen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveUserFromTaskButton;
