import * as React from "react";

import { cn } from "@/lib/utils";

// Base UI has no Label primitive; a native <label> does the same job.
// select-none replaces Radix's "no text selection on double click" behavior.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
