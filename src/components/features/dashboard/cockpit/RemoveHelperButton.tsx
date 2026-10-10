"use client";

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
import { Button } from "@/components/ui/button";
import { removeUserFromTaskAction } from "@/server/actions/participants";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function RemoveHelperButton({
  participantId,
  helperName,
  taskName,
}: {
  participantId: string;
  helperName: string;
  taskName: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      try {
        await removeUserFromTaskAction([participantId]);
        toast.success(`${helperName} ist bei „${taskName}“ ausgetragen.`);
        setOpen(false);
      } catch {
        toast.error("Austragen hat nicht geklappt. Bitte versuche es noch einmal.");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="px-3 text-destructive hover:bg-destructive-surface hover:text-destructive print:hidden"
          >
            Austragen
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{helperName} austragen?</AlertDialogTitle>
          <AlertDialogDescription>
            Der Platz bei „{taskName}“ wird wieder frei. Sag der Person am besten kurz Bescheid.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} autoFocus>
            Behalten
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              remove();
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
}
