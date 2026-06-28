import { NextResponse } from "next/server";
import { cloneFormData } from "@/lib/form-data";
import { backendFetch, proxyBackendResponse } from "@/lib/server-api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const path = query ? `/api/categories?${query}` : "/api/categories";

    const response = await backendFetch(path);
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch categories";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await cloneFormData(await request.formData());
    const response = await backendFetch("/api/categories", {
      method: "POST",
      body: formData,
    });

    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";

    return NextResponse.json({ message }, { status: 500 });
  }
}
