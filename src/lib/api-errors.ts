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
  static unauthorized(message = "Unauthorized") {
    return NextResponse.json<ApiError>(
      { error: message },
      { status: 401 }
    );
  }

  static forbidden(message = "Forbidden") {
    return NextResponse.json<ApiError>(
      { error: message },
      { status: 403 }
    );
  }

  static notFound(message = "Resource not found") {
    return NextResponse.json<ApiError>(
      { error: message },
      { status: 404 }
    );
  }

  static validationError(message: string, details?: unknown) {
    return NextResponse.json<ApiError>(
      { error: message, details },
      { status: 422 }
    );
  }

  static internalError(message = "Internal server error", error?: unknown) {
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

  static badRequest(message = "Bad request", details?: unknown) {
    return NextResponse.json<ApiError>(
      { error: message, details },
      { status: 400 }
    );
  }
}

