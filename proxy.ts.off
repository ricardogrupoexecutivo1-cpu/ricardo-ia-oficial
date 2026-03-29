import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isBlockedPath(pathname: string) {
  const path = pathname.toLowerCase();

  const blockedExact = [
    "/.env",
    "/.env.local",
    "/.env.production",
    "/.env.development",
    "/.git",
    "/.git/config",
    "/.gitignore",
  ];

  const blockedContains = [
    ".env",
    "supabase",
    "secret",
    "config",
    "service_role",
    "service-role",
    "anon_key",
    "anon-key",
  ];

  if (blockedExact.includes(path)) {
    return true;
  }

  return blockedContains.some((term) => path.includes(term));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isBlockedPath(pathname)) {
    return new NextResponse("Acesso negado", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};