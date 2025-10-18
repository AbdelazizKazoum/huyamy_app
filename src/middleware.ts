import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/config";

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow service worker file through without i18n redirect
  if (pathname === "/sw.js") {
    return NextResponse.next();
  }

  // Just handle i18n routing, let client-side guards handle auth
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    // Exclude API, Next.js internals, favicon, and static asset folders
    "/((?!api|_next|favicon.ico|images|videos|profile-pictures).*)",
    "/(ar|fr)/:path*",
  ],
};
