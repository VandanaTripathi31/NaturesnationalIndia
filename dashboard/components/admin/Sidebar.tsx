"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Inbox,
  LogOut,
  Leaf,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
];

type SidebarProps = {
  onClose?: () => void;
  mobileOpen?: boolean;
};

// The sidebar gradient is its own dark treatment — it already reads well on
// dark backgrounds since it's a rich green. We only need CSS-var fixes for
// the collapse toggle button which sits on the page surface.

function LogoMark({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className="flex items-center flex-shrink-0"
      style={{
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? "center" : "flex-start",
        paddingBottom: 16,
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        marginBottom: 20,
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "linear-gradient(135deg, #2F8D6E 0%, #1a5c45 100%)",
          boxShadow: "0 4px 16px rgba(47,141,110,0.35), 0 1px 4px rgba(0,0,0,0.18)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Leaf className="w-5 h-5 text-white" strokeWidth={1.6} />
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            style={{ minWidth: 0 }}
          >
            <p className="font-bold text-white truncate" style={{ fontSize: 13, letterSpacing: "-0.01em" }}>
              Natures Natural
            </p>
            <p className="truncate" style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
              Admin Panel
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarInner({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.div
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className="relative flex flex-col h-full overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #2F8D6E 0%, #1a5c45 100%)",
        borderRadius: 24,
        padding: collapsed ? "20px 10px" : "20px 12px",
        boxShadow: "0 8px 32px rgba(47,141,110,0.28), 0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <LogoMark collapsed={collapsed} />

      <nav className="flex flex-col flex-shrink-0" style={{ gap: 4 }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="relative flex items-center flex-shrink-0 group"
              style={{
                gap: 10,
                padding: collapsed ? "10px 0" : "10px 14px",
                borderRadius: 14,
                fontSize: 13.5,
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                justifyContent: collapsed ? "center" : "flex-start",
                color: active ? "#1a5c45" : "rgba(255,255,255,0.80)",
                transition: "color 0.15s",
                overflow: "hidden",
              }}
            >
              {active ? (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0"
                  style={{ background: "#ffffff", borderRadius: 14, zIndex: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ background: "rgba(255,255,255,0.10)", borderRadius: 14, zIndex: 0 }}
                />
              )}

              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: active ? "rgba(47,141,110,0.10)" : "rgba(255,255,255,0.10)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Icon style={{ width: 15, height: 15, color: active ? "#2F8D6E" : "rgba(255,255,255,0.85)", strokeWidth: active ? 2.2 : 1.8 }} />
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.16 }}
                    style={{ position: "relative", zIndex: 1, whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="flex-shrink-0" style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <Link
          href="/admin/logout"
          title={collapsed ? "Logout" : undefined}
          className="flex items-center group"
          style={{
            gap: 10,
            padding: collapsed ? "10px 0" : "10px 14px",
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.85)",
            transition: "background 0.15s",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.20)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }}>
            <LogOut style={{ width: 14, height: 14, color: "rgba(255,255,255,0.90)" }} strokeWidth={2} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.16 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Collapse toggle — uses CSS vars so it adapts to dark mode */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-20 hidden lg:flex items-center justify-center"
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          boxShadow: "var(--shadow-xs)",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {collapsed
          ? <ChevronRight style={{ width: 13, height: 13, color: "#2F8D6E" }} />
          : <ChevronLeft style={{ width: 13, height: 13, color: "#2F8D6E" }} />
        }
      </button>
    </motion.div>
  );
}

function MobileSidebarInner({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #2F8D6E 0%, #1a5c45 100%)",
        borderRadius: 24,
        padding: "20px 12px",
        boxShadow: "0 8px 32px rgba(47,141,110,0.28), 0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center"
          style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer" }}
          aria-label="Close sidebar"
        >
          <X style={{ width: 14, height: 14, color: "#fff" }} />
        </button>
      )}

      <LogoMark collapsed={false} />

      <nav className="flex flex-col flex-shrink-0" style={{ gap: 4 }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center group"
              style={{
                gap: 10, padding: "10px 14px", borderRadius: 14,
                fontSize: 13.5, fontWeight: active ? 600 : 500,
                textDecoration: "none",
                color: active ? "#1a5c45" : "rgba(255,255,255,0.80)",
                overflow: "hidden",
              }}
            >
              {active && (
                <motion.div layoutId="mobilePill" className="absolute inset-0"
                  style={{ background: "#ffffff", borderRadius: 14, zIndex: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              {!active && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ background: "rgba(255,255,255,0.10)", borderRadius: 14, zIndex: 0 }} />
              )}
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ width: 32, height: 32, borderRadius: 10, background: active ? "rgba(47,141,110,0.10)" : "rgba(255,255,255,0.10)", position: "relative", zIndex: 1 }}>
                <Icon style={{ width: 15, height: 15, color: active ? "#2F8D6E" : "rgba(255,255,255,0.85)", strokeWidth: active ? 2.2 : 1.8 }} />
              </div>
              <span style={{ position: "relative", zIndex: 1, whiteSpace: "nowrap" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="flex-shrink-0" style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <Link
          href="/admin/logout"
          className="flex items-center"
          style={{
            gap: 10, padding: "10px 14px", borderRadius: 100,
            fontSize: 13, fontWeight: 600, textDecoration: "none",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <div className="flex items-center justify-center flex-shrink-0"
            style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }}>
            <LogOut style={{ width: 14, height: 14, color: "rgba(255,255,255,0.90)" }} strokeWidth={2} />
          </div>
          Logout
        </Link>
      </div>
    </div>
  );
}

export default function Sidebar({ onClose, mobileOpen = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]);

  return (
    <>
      <aside
        className="hidden lg:flex flex-col flex-shrink-0"
        style={{ padding: "16px 0 16px 16px", position: "sticky", top: 0, height: "100vh" }}
      >
        <SidebarInner collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 sidebar-backdrop"
              onClick={onClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col"
              style={{ padding: "16px", width: 236 }}
            >
              <MobileSidebarInner onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
