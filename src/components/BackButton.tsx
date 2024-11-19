"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const handleBackNavigation = () => {
    if (
      document.referrer &&
      document.referrer.includes(window.location.origin)
    ) {
      // If the referrer is from the same site, go back
      router.back();
    } else {
      // Otherwise, redirect to a default route, like home
      router.push("/events");
    }
  };
  return (
    <Button
      variant={"outline"}
      onClick={handleBackNavigation}
      className={cn(className, "")}
    >
      <ArrowLeft />
      Zurück
    </Button>
  );
}
