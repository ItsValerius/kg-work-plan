import { NextResponse } from "next/server";

export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
}

/**
 * Standardized error responses for API routes
 */
export class ApiErrorResponse {
  static unauthorized(message = "Dafür musst du angemeldet sein und die nötigen Rechte haben.") {
    return NextResponse.json<ApiError>({ error: message }, { status: 401 });
  }

  static validationError(message: string, details?: unknown) {
    return NextResponse.json<ApiError>({ error: message, details }, { status: 422 });
  }

  static internalError(
    message = "Da ist etwas schiefgelaufen. Bitte versuch es noch einmal.",
    error?: unknown,
  ) {
    const errorResponse: ApiError = { error: message };

    // Only include error details in development
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      errorResponse.details = {
        message: error.message,
        stack: error.stack,
      };
    }

    return NextResponse.json<ApiError>(errorResponse, { status: 500 });
  }

  static badRequest(
    message = "Die Anfrage war unvollständig. Bitte lade die Seite neu und versuch es noch einmal.",
    details?: unknown,
  ) {
    return NextResponse.json<ApiError>({ error: message, details }, { status: 400 });
  }
}
