import type {
  Enquiry,
  EnquiryListResponse,
  EnquiryQueryParams,
  EnquiryStatus,
} from "@/types/enquiry";

function buildQueryString(params: EnquiryQueryParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.q) searchParams.set("q", params.q);
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Something went wrong",
    );
  }

  return data as T;
}

export const enquiryService = {
  async list(params: EnquiryQueryParams = {}) {
    const response = await fetch(`/api/enquiries${buildQueryString(params)}`);
    return handleResponse<EnquiryListResponse>(response);
  },

  async updateStatus(id: string, status: EnquiryStatus) {
    const response = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    return handleResponse<{ enquiry: Enquiry }>(response);
  },

  async remove(id: string) {
    const response = await fetch(`/api/enquiries/${id}`, {
      method: "DELETE",
    });

    return handleResponse<{ message: string }>(response);
  },
};
