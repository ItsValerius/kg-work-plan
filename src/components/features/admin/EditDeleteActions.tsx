"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const iconButton = "size-11 text-muted-foreground hover:text-foreground";

/** Edit and delete for a shift or task in the planning view; deleting asks first. */
export function EditDeleteActions({
  id,
  name,
  kind,
  editHref,
  deleteAction,
}: {
  id: string;
  name: string;
  kind: "Schicht" | "Aufgabe";
  editHref: string;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAction(id);
        toast.success(`${kind} „${name}“ wurde gelöscht.`);
        setOpen(false);
      } catch {
        toast.error(`Die ${kind} konnte nicht gelöscht werden. Bitte versuche es noch einmal.`);
      }
    });
  };

  return (
    <div className="flex shrink-0 items-center">
      <Link
        href={editHref}
        aria-label={`${kind} „${name}“ bearbeiten`}
        className={buttonVariants({ variant: "ghost", size: "icon", className: iconButton })}
      >
        <Pencil className="size-4" />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`${kind} „${name}“ löschen`}
        className={`${iconButton} hover:text-destructive`}
        onClick={() => setOpen(true)}
      >
        <Trash className="size-4" />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {kind} „{name}“ löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {kind === "Schicht"
                ? "Alle Aufgaben dieser Schicht und ihre Eintragungen werden mitgelöscht. Das lässt sich nicht rückgängig machen."
                : "Alle Eintragungen für diese Aufgabe werden mitgelöscht. Das lässt sich nicht rückgängig machen."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Wird gelöscht …" : "Löschen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
