import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/utils";

/**
 * This middleware is OPTIONAL and provides optimistic redirects for better UX.
 * 
 * SECURITY NOTE: This middleware is NOT secure by itself. All routes that require
 * authentication MUST have proper auth checks in their page/layout components or
 * API routes. Middleware can be bypassed and should not be the only security layer.
 * 
 * This middleware:
 * - Allows public routes: /, /events, /events/[eventId], /signin, /verify-request
 * - Redirects authenticated routes to /signin if no session exists
 * 
 * Each protected route should independently verify auth using:
 * - getAuthenticatedUser() / getAuthenticatedAdminUserId() in pages
 * - Auth checks in layouts for route groups
 * - getAuthenticatedUserId() / getAuthenticatedAdminUserId() in API routes
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Public routes that don't require authentication
    const publicRoutes = [
        "/",
        "/signin",
        "/verify-request",
    ];
    
    // Check if route is public (exact match or starts with /events)
    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/events");
    
    if (isPublicRoute) {
        return NextResponse.next();
    }
    
    // For all other routes, check authentication
    const session = await getSession();
    
    if (!session) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};