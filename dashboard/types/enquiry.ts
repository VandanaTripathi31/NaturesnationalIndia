export type EnquiryStatus = "new" | "read" | "responded" | "archived";

export type Enquiry = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  category?: string;
  quantity?: string;
  message?: string;
  source?: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
};

export type EnquiryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type EnquiryListResponse = {
  enquiries: Enquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type EnquiryQueryParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: EnquiryStatus;
};
