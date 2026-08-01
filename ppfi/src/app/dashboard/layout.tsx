import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ROLES } from "@/config/roles";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(ROLES.STUDENT, "/dashboard");
  return <DashboardShell>{children}</DashboardShell>;
}
