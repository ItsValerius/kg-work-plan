/**
 * Structured logs: one JSON line per entry on the console, which Vercel collects in
 * every environment. Usage: logger.error("Failed to save", error, { eventId }).
 */

type LogContext = Record<string, unknown>;

function write(level: "debug" | "info" | "warn" | "error", message: string, context?: LogContext) {
  const line = JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...context });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

function describe(error: unknown) {
  return error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : error;
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === "development") write("debug", message, context);
  },
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error(message: string, error?: unknown, context?: LogContext) {
    write("error", message, error === undefined ? context : { ...context, error: describe(error) });
  },
};
