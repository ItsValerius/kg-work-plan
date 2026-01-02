"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
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
} from "../ui/alert-dialog";

const DeleteButton = ({
  deleteAction,
  className,
  id,
}: {
  className: string;
  id: string;
  deleteAction: (id: string) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className={cn("aspect-square", className)}
          disabled={isPending}
          aria-label="Löschen"
        >
          <Trash aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Das Löschen von Veranstaltungen, Schichten und Aufgaben kann nicht
            wieder Rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Button
              disabled={isPending}
              onClick={() => startTransition(() => deleteAction(id))}
            >
              Löschen
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;

