/**
 * Production-ready logging utility
 * 
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info("Event created", { eventId: "123" });
 *   logger.error("Failed to process", error, { userId: "456" });
 * 
 * Integration with external services:
 * 
 * 1. Sentry (Recommended for error tracking):
 *    npm install @sentry/nextjs
 *    Uncomment Sentry code in error() method below
 * 
 * 2. Vercel Logging:
 *    Automatically captures console.log in production
 *    View logs in Vercel dashboard
 * 
 * 3. Custom logging service:
 *    Add your service integration in the production blocks below
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isProduction = process.env.NODE_ENV === "production";

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    if (this.isDevelopment) {
      // In development, use console with appropriate method
      const consoleMethod = level === "error" ? "error" : level === "warn" ? "warn" : "log";
      console[consoleMethod](`[${timestamp}] ${level.toUpperCase()}:`, message, context || "");
    }

    // In production, return structured log entry for external services
    return logEntry;
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      const logEntry = this.formatMessage("debug", message, context);
      // In production, you might want to filter out debug logs
      // or send to a different service
    }
  }

  info(message: string, context?: LogContext) {
    const logEntry = this.formatMessage("info", message, context);
    
    if (this.isProduction) {
      // In production, send to your logging service
      // Example: sendToLogService(logEntry);
      // Or use Vercel's built-in logging which automatically captures console.log
      // You could also integrate with Sentry, LogRocket, etc.
    }
  }

  warn(message: string, context?: LogContext) {
    const logEntry = this.formatMessage("warn", message, context);
    
    if (this.isProduction) {
      // Send warnings to logging service
      // Example: sendToLogService(logEntry);
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext: LogContext = {
      ...context,
    };

    if (error instanceof Error) {
      errorContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      errorContext.error = error;
    }

    const logEntry = this.formatMessage("error", message, errorContext);

    if (this.isProduction) {
      // In production, send errors to error tracking service
      
      // Option 1: Sentry (Recommended - uncomment after installing @sentry/nextjs)
      // if (typeof window === "undefined") {
      //   const * as Sentry from "@sentry/nextjs";
      //   Sentry.captureException(error instanceof Error ? error : new Error(message), {
      //     extra: context,
      //     level: "error",
      //   });
      // }
      
      // Option 2: Vercel automatically captures console.error in production
      // View logs at: https://vercel.com/dashboard -> Your Project -> Logs
      
      // Option 3: Send to your custom logging service
      // Example: await fetch("https://your-logging-service.com/logs", {
      //   method: "POST",
      //   body: JSON.stringify(logEntry),
      // });
      
      // Option 4: Send to external monitoring (Datadog, New Relic, etc.)
    }
  }
}

// Export a singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogLevel, LogContext };

