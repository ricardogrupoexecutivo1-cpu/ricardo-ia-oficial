import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function applyNoCacheHeaders(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  const shouldDisableCache =
    pathname === "/planos" ||
    pathname.startsWith("/planos/") ||
    pathname === "/chat" ||
    pathname.startsWith("/chat/") ||
    pathname === "/explorar" ||
    pathname.startsWith("/explorar/") ||
    pathname === "/sw.js" ||
    pathname.startsWith("/api/");

  if (shouldDisableCache) {
    applyNoCacheHeaders(response);
  }

  return response;
}

export const config = {
  matcher: [
    "/planos",
    "/planos/:path*",
    "/chat",
    "/chat/:path*",
    "/explorar",
    "/explorar/:path*",
    "/sw.js",
    "/api/:path*",
  ],
};