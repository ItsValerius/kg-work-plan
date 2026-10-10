"use client";

import { logger } from "@/lib/logger";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// notFound() and redirect() work by throwing; they belong to Next.js, not to this boundary.
function isNextNavigationError(error: unknown): boolean {
  const digest = (error as { digest?: unknown } | null)?.digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_HTTP_ERROR_FALLBACK") || digest.startsWith("NEXT_REDIRECT"))
  );
}

// Error Boundaries must be class components - React doesn't support error boundaries in function components yet
// This is a React limitation, not a design choice
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    if (isNextNavigationError(error)) return;
    logger.error("ErrorBoundary caught an error", error, {
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (isNextNavigationError(this.state.error)) {
        throw this.state.error;
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div role="alert" className="max-w-xl rounded-xl border bg-muted p-6 md:p-9">
            <h1 className="text-[44px] md:text-[48px]">Da ist etwas schiefgelaufen</h1>
            <p className="mt-3 text-[17px] text-muted-foreground">
              Die Seite konnte gerade nicht geladen werden. Das liegt nicht an dir – versuch es
              bitte noch einmal. Deine Einträge sind dadurch nicht verloren.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Fehlerdetails
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-background p-2 text-xs">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={this.handleReset}>Noch einmal versuchen</Button>
              <Link href="/veranstaltungen" className={buttonVariants({ variant: "outline" })}>
                Zu den Veranstaltungen
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
