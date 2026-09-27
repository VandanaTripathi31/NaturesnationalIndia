import { NextResponse } from "next/server";
import api from "@/lib/api";
import { AUTH_COOKIE_NAME, type AuthResponse } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const { data } = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });

    const response = NextResponse.json({
      message: "Login successful",
      admin: data.admin,
    });

    response.cookies.set(AUTH_COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in";

    return NextResponse.json({ message }, { status: 401 });
  }
}
