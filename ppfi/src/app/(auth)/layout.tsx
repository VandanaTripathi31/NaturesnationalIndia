import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 45%)",
          }}
        />
        <Link href="/" className="relative z-10 font-display text-lg font-semibold">
          {siteConfig.shortName}
        </Link>
        <div className="relative z-10 space-y-4">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            {siteConfig.tagline}
          </h2>
          <p className="max-w-sm text-sm text-primary-foreground/70">
            Learn videography, editing and digital marketing from active industry
            professionals at {siteConfig.parentCompany}.
          </p>
        </div>
        <p className="relative z-10 text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} {siteConfig.parentCompany}
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
