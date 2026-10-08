"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Sonner's own styles win on specificity, so the flat family look is marked important.
          toast:
            "bg-background! text-foreground! border! border-border! rounded-md! shadow-none! font-sans! text-[15px]!",
          success: "[&_[data-icon]]:text-primary!",
          error: "[&_[data-icon]]:text-destructive!",
          description: "text-muted-foreground!",
          actionButton:
            "bg-primary! text-primary-foreground! font-semibold! rounded-md! min-h-9! px-3! text-sm!",
          cancelButton: "bg-muted! text-muted-foreground!",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
