"use client";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";

const EditButton = ({ 
  className, 
  ariaLabel = "Bearbeiten" 
}: { 
  className: string;
  ariaLabel?: string;
}) => {
  return (
    <Button 
      variant="secondary" 
      size="icon" 
      className={cn("aspect-square", className)}
      aria-label={ariaLabel}
    >
      <Pencil aria-hidden="true" />
    </Button>
  );
};

export default EditButton;

