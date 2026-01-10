"use client";

import React, { useState, useTransition } from "react";
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
import { MoreVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { ShiftAdminActionsProps } from "./types";

export function ShiftAdminActions({
  eventId,
  shiftId,
  deleteAction,
}: ShiftAdminActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteAction(shiftId);
        toast.success("Schicht wurde erfolgreich gelöscht");
        setDeleteOpen(false);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
            toast.error("Du hast keine Berechtigung, Schichten zu löschen");
          } else {
            toast.error(error.message || "Fehler beim Löschen der Schicht");
          }
        } else {
          toast.error("Fehler beim Löschen der Schicht");
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
            aria-label="Schicht-Optionen"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="focus:outline-none">
          <DropdownMenuItem asChild>
            <Link
              href={`/events/${eventId}/shifts/${shiftId}/edit`}
              className="flex items-center cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Bearbeiten
            </Link>
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
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bist du dir sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Das Löschen von Schichten kann nicht wieder Rückgängig gemacht werden.
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

