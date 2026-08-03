import Link from "next/link";
import { Award, Building2, Inbox, Mail, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { getAdminStats, getRecentInquiries } from "@/features/admin/data";

const statusVariant: Record<string, "default" | "secondary" | "muted"> = {
  new: "default",
  contacted: "secondary",
  converted: "muted",
  closed: "muted",
};

export default async function AdminDashboardPage() {
  const [stats, inquiries] = await Promise.all([getAdminStats(), getRecentInquiries()]);

  const cards = [
    { label: "Students", value: stats.students, icon: Users, href: "/admin/students" },
    { label: "Active enrollments", value: stats.activeEnrollments, icon: TrendingUp, href: "/admin/students" },
    { label: "New inquiries", value: stats.newInquiries, icon: Inbox, href: "/admin/inquiries" },
    { label: "Certificates", value: stats.certificates, icon: Award, href: "/admin/certificates" },
    { label: "Organizations", value: stats.organizations, icon: Building2, href: "/admin/organizations" },
    { label: "Unread messages", value: stats.messages, icon: Mail, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Operational overview across both business lines." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border bg-card p-5 transition-colors hover:bg-accent/40">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <c.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold">{c.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        {inquiries.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No inquiries yet.
          </p>
        ) : (
          <div className="divide-y rounded-xl border bg-card">
            {inquiries.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{i.instituteName}</p>
                  <p className="text-xs text-muted-foreground">{i.contactPerson}</p>
                </div>
                <Badge variant={statusVariant[i.status] ?? "muted"}>{i.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
