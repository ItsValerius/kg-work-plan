import { auth } from "@/lib/auth/auth";
import { parseSetCookieHeader } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes Better Auth's session cookie cache. Server Components can't set cookies, so
 * without this the cache written at sign-in would expire and every page would go back to
 * the database. Not an auth check: pages, actions and routes still check for themselves.
 */
export async function proxy(request: NextRequest) {
  let setCookies: string[];
  try {
    const { headers } = await auth.api.getSession({
      headers: request.headers,
      returnHeaders: true,
    });
    setCookies = headers.getSetCookie();
  } catch {
    // The page's own session read decides what to show when the database is down.
    return NextResponse.next();
  }
  if (setCookies.length === 0) return NextResponse.next();

  // This request's render gets the fresh cookies too, so it doesn't look the session up again.
  for (const [name, { value, "max-age": maxAge }] of parseSetCookieHeader(setCookies.join(", "))) {
    if (maxAge === 0) request.cookies.delete(name);
    else request.cookies.set(name, value);
  }
  const response = NextResponse.next({ request: { headers: request.headers } });
  for (const cookie of setCookies) response.headers.append("set-cookie", cookie);
  return response;
}

export const config = {
  // Pages and server actions; not API routes, build output or files.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
