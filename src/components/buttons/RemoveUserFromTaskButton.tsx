"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { remove } from "@/app/profile/actions";

const RemoveUserFromTaskButton = ({ taskId }: { taskId: string | null }) => {
  const [isPending, startTransition] = useTransition();

  if (!taskId) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      onClick={() => startTransition(() => remove(taskId))}
      disabled={isPending}
    >
      {isPending ? "Wird entfernt..." : "Aufgabe Entfernen"}
    </Button>
  );
};

export default RemoveUserFromTaskButton;

