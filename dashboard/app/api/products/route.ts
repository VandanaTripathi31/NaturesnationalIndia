import { NextResponse } from "next/server";
import { backendFetch, proxyBackendResponse } from "@/lib/server-api";
import { cloneFormData } from "@/lib/form-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const path = query ? `/api/products?${query}` : "/api/products";
    const response = await backendFetch(path);
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await cloneFormData(await request.formData());
    const response = await backendFetch("/api/products", {
      method: "POST",
      body: formData,
    });
    return proxyBackendResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ message }, { status: 500 });
  }
}
