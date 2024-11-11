"use client";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";

const EditButton = ({ className }: { className: string }) => {
  return (
    <Button variant="secondary" className={cn(className, "")}>
      <Pencil />
    </Button>
  );
};

export default EditButton;
