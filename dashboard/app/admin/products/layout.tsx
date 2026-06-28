import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { AUTH_COOKIE_NAME, decodeJwtPayload } from "@/lib/auth";

async function getAdminName() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return "Admin";
  const payload = decodeJwtPayload(token);
  return typeof payload?.name === "string" ? payload.name : "Admin";
}

export const metadata = {
  title: "Products | Admin",
};

export default async function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const adminName = await getAdminName();
  return <AdminShell adminName={adminName}>{children}</AdminShell>;
}
