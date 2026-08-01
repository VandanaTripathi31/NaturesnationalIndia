import { ROLES } from "@/config/roles";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { requireRole } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await requireRole(ROLES.STUDENT, "/dashboard");

  return (
    <main className="container flex min-h-screen flex-col justify-center py-16">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Student dashboard</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Welcome, {user.name?.split(" ")[0]}
            </h1>
          </div>
          <SignOutButton />
        </div>
        <p className="text-muted-foreground">
          Your enrolled courses, progress and certificates will appear here in Phase 4.
        </p>
      </div>
    </main>
  );
}
