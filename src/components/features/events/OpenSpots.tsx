import { cn } from "@/lib/utils";

interface OpenSpotsProps {
  open: number;
  required: number;
  className?: string;
}

/**
 * One plain sentence about where help is still missing.
 */
export function OpenSpots({ open, required, className }: OpenSpotsProps) {
  if (required === 0) {
    return (
      <p className={cn("text-[15px] text-muted-foreground", className)}>
        Aufgaben werden noch geplant
      </p>
    );
  }

  if (open === 0) {
    return (
      <p className={cn("text-[15px] font-semibold text-muted-foreground", className)}>
        Alle {required} Plätze belegt – danke!
      </p>
    );
  }

  return (
    <p className={cn("text-[15px] font-semibold text-primary", className)}>
      Noch {open} {open === 1 ? "Platz" : "Plätze"} frei
      <span className="font-normal text-muted-foreground"> von {required}</span>
    </p>
  );
}
