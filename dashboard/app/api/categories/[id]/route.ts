import { NextResponse } from "next/server";
import { cloneFormData } from "@/lib/form-data";
import { backendFetch, proxyBackendResponse } from "@/lib/server-api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const response = await backendFetch(`/api/categories/${id}`);
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch category";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const formData = await cloneFormData(await request.formData());
    const response = await backendFetch(`/api/categories/${id}`, {
      method: "PUT",
      body: formData,
    });

    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update category";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const response = await backendFetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category";

    return NextResponse.json({ message }, { status: 500 });
  }
}
