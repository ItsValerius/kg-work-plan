"use client";

import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
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
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Card className="m-4">
                    <CardHeader>
                        <CardTitle>Etwas ist schiefgelaufen</CardTitle>
                        <CardDescription>
                            Es gab einen Fehler beim Laden dieser Seite. Bitte versuchen Sie
                            es erneut.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-sm text-muted-foreground">
                                    Fehlerdetails
                                </summary>
                                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                                    {this.state.error.message}
                                    {"\n"}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={this.handleReset}>Seite neu laden</Button>
                    </CardFooter>
                </Card>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
