import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "form" | "wide" | "auth";
}

const variantClasses = {
  default: "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8",
  form: "p-4 flex flex-col gap-2 max-w-3xl w-full mx-auto",
  wide: "container mx-auto py-8 px-4 md:px-0",
  auth: "container mx-auto max-w-md flex flex-col gap-2",
};

export function PageContainer({ children, className, variant = "default" }: PageContainerProps) {
  return (
    <main id="main-content" className={cn(variantClasses[variant], className)}>
      {children}
    </main>
  );
}
