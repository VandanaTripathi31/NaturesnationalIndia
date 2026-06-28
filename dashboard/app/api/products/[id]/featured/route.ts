import { NextResponse } from "next/server";
import { backendFetch, proxyBackendResponse } from "@/lib/server-api";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const response = await backendFetch(`/api/products/${id}/featured`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update featured status";
    return NextResponse.json({ message }, { status: 500 });
  }
}
