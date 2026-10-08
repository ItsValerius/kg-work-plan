"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
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

export function ShiftAdminActions({ eventId, shiftId, deleteAction }: ShiftAdminActionsProps) {
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
    <div className="absolute top-3 right-3 z-10 md:top-4 md:right-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-0 focus-visible:outline-hidden"
              aria-label="Schicht-Optionen"
            >
              <MoreVertical className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="focus:outline-hidden">
          <DropdownMenuLinkItem
            render={<Link href={`/events/${eventId}/shifts/${shiftId}/edit`} />}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 size-4" />
            Bearbeiten
          </DropdownMenuLinkItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            <Trash className="mr-2 size-4" />
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
