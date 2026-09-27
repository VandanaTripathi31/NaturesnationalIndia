import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import LoadingSpinner from "@/components/admin/LoadingSpinner";

export const metadata = {
  title: "Login | Admin",
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading login..." className="min-h-screen bg-slate-950" />}>
      <LoginForm />
    </Suspense>
  );
}
