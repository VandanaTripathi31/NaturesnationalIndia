import Link from "next/link";
import { Award, BookOpen, TrendingUp } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth/session";
import { getStudentCertificates, getStudentEnrollments } from "@/features/dashboard/data";

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  const [enrollments, certificates] = await Promise.all([
    getStudentEnrollments(user!.id),
    getStudentCertificates(user!.id),
  ]);

  const active = enrollments.filter((e) => e.status === "active");
  const completed = enrollments.filter((e) => e.status === "completed");
  const avgProgress =
    enrollments.length === 0
      ? 0
      : Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length);

  const stats = [
    { label: "Enrolled courses", value: enrollments.length, icon: BookOpen },
    { label: "Completed", value: completed.length, icon: TrendingUp },
    { label: "Certificates", value: certificates.length, icon: Award },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user!.name?.split(" ")[0] ?? "there"}`}
        description="Here's a snapshot of your learning journey."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Continue learning</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/courses">View all</Link>
          </Button>
        </div>

        {active.length === 0 ? (
          <EmptyState
            title="No active courses yet"
            description="Browse the catalogue and enrol in a course to start building your portfolio."
            action={
              <Button asChild>
                <Link href="/courses">Browse courses</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {active.slice(0, 3).map((e) => (
              <div key={e.id} className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{e.courseTitle}</p>
                    <p className="text-xs text-muted-foreground">{e.courseCategory}</p>
                  </div>
                  <span className="text-sm font-medium">{e.progress}%</span>
                </div>
                <Progress value={e.progress} className="mt-3" />
              </div>
            ))}
          </div>
        )}
      </section>

      {enrollments.length > 0 ? (
        <div className="mt-8 rounded-xl border bg-muted/30 p-5">
          <p className="text-sm text-muted-foreground">Overall progress</p>
          <div className="mt-3 flex items-center gap-4">
            <Progress value={avgProgress} />
            <span className="text-sm font-semibold">{avgProgress}%</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
