import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
        {siteConfig.parentCompany} · Education
      </span>
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-xl text-balance text-lg text-muted-foreground">
        {siteConfig.tagline} — the production-grade foundation is live. Public website,
        dashboards, payments and certificates arrive in the upcoming phases.
      </p>
    </main>
  );
}
