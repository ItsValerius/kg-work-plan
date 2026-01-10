"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { removeUserFromTask } from "@/server/actions/users";

const RemoveUserFromTaskButton = ({ taskId }: { taskId: string | null }) => {
  const [isPending, startTransition] = useTransition();

  if (!taskId) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      onClick={() => startTransition(async () => {
        await removeUserFromTask(taskId);
      })}
      disabled={isPending}
    >
      {isPending ? "Wird entfernt..." : "Aufgabe Entfernen"}
    </Button>
  );
};

export default RemoveUserFromTaskButton;

