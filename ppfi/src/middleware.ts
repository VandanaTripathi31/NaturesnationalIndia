import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { ROLES } from "@/config/roles";

/**
 * Edge middleware guarding authenticated areas. It reads the NextAuth JWT
 * directly (no DB call) so it stays fast and edge-compatible.
 *
 * - /dashboard/**  → STUDENT (any authenticated non-admin lands here)
 * - /admin/**      → ADMIN only
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAdminArea = pathname.startsWith("/admin");
  const isDashboardArea = pathname.startsWith("/dashboard");

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminArea && token.role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isDashboardArea && token.role === ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
