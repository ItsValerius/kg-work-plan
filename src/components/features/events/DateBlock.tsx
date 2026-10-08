import { getDateParts } from "@/lib/datetime";
import { cn } from "@/lib/utils";

interface DateBlockProps {
  date: Date;
  size?: "md" | "lg";
  muted?: boolean;
  className?: string;
}

/**
 * The family's date-led anchor: a large condensed day numeral with weekday and month beside it.
 */
export function DateBlock({ date, size = "md", muted = false, className }: DateBlockProps) {
  const { day, weekday, month } = getDateParts(date);

  return (
    <div
      className={cn(
        "tabular flex items-center gap-2",
        muted ? "text-muted-foreground" : "text-primary",
        className,
      )}
    >
      <span
        className={cn(
          "font-display leading-none font-bold tracking-[-0.02em]",
          size === "lg" ? "text-[56px] md:text-[72px]" : "text-[40px] md:text-[44px]",
        )}
      >
        {day}
      </span>
      <span
        className={cn(
          "flex flex-col leading-tight font-semibold uppercase",
          size === "lg" ? "text-[13px] md:text-[15px]" : "text-[12px]",
        )}
      >
        <span>{weekday}</span>
        <span className={muted ? "" : "text-foreground"}>{month}</span>
      </span>
    </div>
  );
}
