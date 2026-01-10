"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { removeUserFromTask } from "@/server/actions/users";
import { toast } from "sonner";

const RemoveUserFromTaskButton = ({ taskId }: { taskId: string | null }) => {
  const [isPending, startTransition] = useTransition();

  if (!taskId) {
    return null;
  }

  const handleRemove = async () => {
    startTransition(async () => {
      try {
        await removeUserFromTask(taskId);
        toast.success("Du wurdest erfolgreich von der Aufgabe entfernt");
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
            toast.error("Du hast keine Berechtigung für diese Aktion");
          } else {
            toast.error(error.message || "Fehler beim Entfernen von der Aufgabe");
          }
        } else {
          toast.error("Fehler beim Entfernen von der Aufgabe");
        }
      }
    });
  };

  return (
    <Button
      variant="destructive"
      onClick={handleRemove}
      disabled={isPending}
    >
      {isPending ? "Wird entfernt..." : "Aufgabe Entfernen"}
    </Button>
  );
};

export default RemoveUserFromTaskButton;

