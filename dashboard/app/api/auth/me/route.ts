import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, decodeJwtPayload, isTokenExpired } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token || isTokenExpired(token)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = decodeJwtPayload(token);

  return NextResponse.json({
    admin: {
      id: payload?.id,
      name: payload?.name,
      email: payload?.email,
      role: payload?.role,
    },
  });
}
