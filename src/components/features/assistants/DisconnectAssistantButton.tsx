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
import { disconnectAssistant } from "@/server/actions/assistants";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DisconnectAssistantButton({ clientId, name }: { clientId: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function disconnect() {
    startTransition(async () => {
      const result = await disconnectAssistant(clientId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`${name} ist getrennt.`);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="px-3 text-destructive hover:bg-destructive-surface hover:text-destructive"
          >
            Trennen
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{name} trennen?</AlertDialogTitle>
          <AlertDialogDescription>
            Der Assistent kann ab sofort nicht mehr auf den Arbeitsplan zugreifen. Du kannst ihn
            jederzeit wieder verbinden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} autoFocus>
            Verbunden lassen
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              disconnect();
            }}
            disabled={isPending}
            className="bg-danger text-white hover:bg-destructive"
          >
            {isPending ? "Wird getrennt …" : "Ja, trennen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
