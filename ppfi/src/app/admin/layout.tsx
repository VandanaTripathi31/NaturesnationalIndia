import { AdminShell } from "@/components/admin/admin-shell";
import { ROLES } from "@/config/roles";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(ROLES.ADMIN, "/admin");
  return <AdminShell>{children}</AdminShell>;
}
