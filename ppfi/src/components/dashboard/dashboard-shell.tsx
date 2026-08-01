"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dashboardNav } from "@/config/dashboard-nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {dashboardNav.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden flex-col border-r border-border/60 bg-muted/20 p-4 lg:flex">
        <Link href="/" className="px-3 py-2 font-display text-lg font-semibold">
          {siteConfig.shortName}
        </Link>
        <div className="mt-6 flex-1">
          <NavLinks />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="justify-start"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border/60 px-4 lg:hidden">
          <Link href="/" className="font-display font-semibold">
            {siteConfig.shortName}
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-md"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>

        {open ? (
          <div className="border-b border-border/60 p-4 lg:hidden">
            <NavLinks onNavigate={() => setOpen(false)} />
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full justify-start"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        ) : null}

        <div className="flex-1 p-6 lg:p-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
