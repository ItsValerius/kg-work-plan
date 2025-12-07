"use client";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";

const EditButton = ({ className }: { className: string }) => {
  return (
    <Button variant="secondary" size="icon" className={cn("aspect-square", className)}>
      <Pencil />
    </Button>
  );
};

export default EditButton;
