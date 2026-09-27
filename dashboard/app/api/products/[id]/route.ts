import { NextResponse } from "next/server";
import { backendFetch, proxyBackendResponse } from "@/lib/server-api";
import { cloneFormData } from "@/lib/form-data";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const response = await backendFetch(`/api/products/${id}`);
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch product";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const formData = await cloneFormData(await request.formData());
    const response = await backendFetch(`/api/products/${id}`, {
      method: "PUT",
      body: formData,
    });
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const response = await backendFetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ message }, { status: 500 });
  }
}
