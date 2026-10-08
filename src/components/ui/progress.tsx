"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

/**
 * The bar itself is the Track, so `className` lands there; that keeps callers'
 * `[&>div]:bg-…` selectors pointing at the indicator. The primitive sizes the fill.
 */
function Progress({ className, ...props }: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className="w-full" {...props}>
      <ProgressPrimitive.Track
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      >
        <ProgressPrimitive.Indicator className="h-full bg-primary transition-all" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
