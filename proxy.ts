import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/utils";

export async function proxy(request: NextRequest) {
    const session = await getSession();

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
    if(!session) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  };