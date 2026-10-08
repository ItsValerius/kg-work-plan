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
import { deleteEvent } from "@/server/actions/events";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DeleteEventButton({ eventId, eventName }: { eventId: string; eventName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      try {
        await deleteEvent(eventId);
        toast.success(`„${eventName}“ wurde gelöscht.`);
        setOpen(false);
        router.push("/dashboard");
      } catch {
        toast.error("Löschen hat nicht geklappt. Bitte versuche es noch einmal.");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="px-3 text-destructive hover:bg-destructive-surface hover:text-destructive">
          <Trash2 aria-hidden="true" />
          Löschen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>„{eventName}“ löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Alle Schichten, Aufgaben und Anmeldungen dieser Veranstaltung werden ebenfalls gelöscht. Das lässt
            sich nicht rückgängig machen.
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
            {isPending ? "Wird gelöscht …" : "Ja, löschen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
