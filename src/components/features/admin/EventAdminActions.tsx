"use client";

import React, { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreVertical, Pencil, Trash, Copy } from "lucide-react";
import Link from "next/link";
import { DuplicateEventDialog } from "@/components/shared/dialogs/DuplicateEventDialog";
import { toast } from "sonner";
import type { EventAdminActionsProps } from "./types";

export function EventAdminActions({
  eventId,
  eventName,
  eventStartDate,
  eventEndDate,
  deleteAction,
}: EventAdminActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const duplicateButtonRef = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteAction(eventId);
        toast.success("Veranstaltung wurde erfolgreich gelöscht");
        setDeleteOpen(false);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
            toast.error("Du hast keine Berechtigung, Veranstaltungen zu löschen");
          } else {
            toast.error(error.message || "Fehler beim Löschen der Veranstaltung");
          }
        } else {
          toast.error("Fehler beim Löschen der Veranstaltung");
        }
      }
    });
  };

  return (
    <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-0"
            aria-label="Veranstaltungs-Optionen"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="focus:outline-none">
          <DropdownMenuItem asChild>
            <Link
              href={`/events/${eventId}/edit`}
              className="flex items-center cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Bearbeiten
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              duplicateButtonRef.current?.click();
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplizieren
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="hidden">
        <DuplicateEventDialog
          eventId={eventId}
          defaultName={eventName}
          defaultStartDate={eventStartDate}
          defaultEndDate={eventEndDate}
          trigger={
            <Button
              ref={duplicateButtonRef}
              variant="ghost"
              size="icon"
            >
              <Copy />
            </Button>
          }
        />
      </div>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Das Löschen von Veranstaltungen kann nicht wieder Rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Wird gelöscht..." : "Löschen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

