import { ROLES } from "@/config/roles";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { requireRole } from "@/lib/auth/session";

export default async function AdminPage() {
  const user = await requireRole(ROLES.ADMIN, "/admin");

  return (
    <main className="container flex min-h-screen flex-col justify-center py-16">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Admin panel</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              {user.name}
            </h1>
          </div>
          <SignOutButton />
        </div>
        <p className="text-muted-foreground">
          Course, student, mentor, batch and certificate management arrive in Phase 5.
        </p>
      </div>
    </main>
  );
}
