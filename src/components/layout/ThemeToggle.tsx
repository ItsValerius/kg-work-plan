"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    // The hidden label names the theme a click switches to; CSS picks it, like the icons,
    // so server and client markup match before the theme is known.
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-11 text-foreground", className)}
      title="Design wechseln"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon className="size-4.5 dark:hidden" />
      <Sun className="hidden size-4.5 dark:block" />
      <span className="sr-only dark:hidden">Dunkles Design</span>
      <span className="sr-only hidden dark:inline">Helles Design</span>
    </Button>
  );
}
