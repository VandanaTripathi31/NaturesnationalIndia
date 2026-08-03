import { NextResponse } from "next/server";
import { backendFetch, proxyBackendResponse } from "@/lib/server-api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const path = query ? `/api/enquiries?${query}` : "/api/enquiries";
    const response = await backendFetch(path);
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch enquiries";
    return NextResponse.json({ message }, { status: 500 });
  }
}
