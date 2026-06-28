import { NextResponse } from "next/server";
import { backendFetch, proxyBackendResponse } from "@/lib/server-api";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const path = query
      ? `/api/products/${id}/related?${query}`
      : `/api/products/${id}/related`;
    const response = await backendFetch(path);
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch related products";
    return NextResponse.json({ message }, { status: 500 });
  }
}
