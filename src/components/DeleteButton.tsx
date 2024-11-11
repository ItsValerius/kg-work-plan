"use client";
import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Button
      variant="destructive"
      className={cn(className, "")}
      onClick={() => startTransition(() => deleteAction(id))}
      disabled={isPending}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
