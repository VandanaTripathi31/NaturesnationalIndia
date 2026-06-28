"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserCircle2,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "@/components/admin/theme/ThemeProvider";

const pageTitles: Record<string, { title: string; eyebrow: string }> = {
  "/admin/dashboard": { title: "Dashboard Overview", eyebrow: "Overview" },
  "/admin/categories": { title: "Category Management", eyebrow: "Catalogue" },
  "/admin/products": { title: "Product Management", eyebrow: "Catalogue" },
  "/admin/orders": { title: "Order Management", eyebrow: "Commerce" },
  "/admin/customers": { title: "Customer Management", eyebrow: "Commerce" },
  "/admin/reports": { title: "Reports & Analytics", eyebrow: "Insights" },
  "/admin/settings": { title: "Settings", eyebrow: "Configuration" },
};

type NavbarProps = {
  onMenuClick?: () => void;
  adminName?: string;
  adminRole?: string;
};

// Brand constants — single source of truth, matches login form + sidebar
const BRAND = {
  green: "#2F8D6E",
  dark: "#1a5c45",
  hover: "#267a5e",
  shadow: "rgba(47,141,110,0.32)",
  shadowHover: "rgba(47,141,110,0.42)",
  focus: "rgba(47,141,110,0.18)",
} as const;

export default function Navbar({
  onMenuClick,
  adminName = "Admin",
  adminRole = "Super Admin",
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = adminName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("nb-search-input")?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Failed to log out");
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setMenuOpen(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes nb-fade-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Search box */
        .nb-search-box {
          transition: box-shadow 0.2s ease, background 0.2s ease;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05),
                      inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .nb-search-box:focus-within {
          background: rgba(255,255,255,0.98) !important;
          box-shadow: 0 0 0 2.5px ${BRAND.green},
                      0 4px 20px ${BRAND.focus} !important;
        }
        [data-theme="dark"] .nb-search-box {
          background: rgba(255,255,255,0.08) !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.28),
                      inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
        [data-theme="dark"] .nb-search-box:focus-within {
          background: rgba(255,255,255,0.13) !important;
          box-shadow: 0 0 0 2.5px ${BRAND.green},
                      0 4px 20px ${BRAND.focus} !important;
        }
        .nb-search-box:focus-within .nb-search-icon {
          color: ${BRAND.green} !important;
        }
        .nb-search-icon { transition: color 0.15s ease; }

        /* Chevron */
        .nb-chevron-open { transform: rotate(180deg); }

        /* Dropdown entrance */
        .nb-dropdown { animation: nb-fade-in 0.14s ease; }

        /* Pill hover states — unified brand green */
        .nb-theme-pill:hover {
          background: ${BRAND.hover} !important;
          box-shadow: 0 6px 20px ${BRAND.shadowHover} !important;
        }
        .nb-user-pill:hover {
          background: ${BRAND.hover} !important;
          box-shadow: 0 6px 20px ${BRAND.shadowHover} !important;
        }

        /* Transparent navbar card */
        .nb-card { background: transparent; }

        /* Dropdown dark mode */
        [data-theme="dark"] .nb-dropdown-wrap {
          background: #0d3d2e;
          border-color: rgba(255,255,255,0.10);
        }
        [data-theme="dark"] .nb-dd-item { color: #eef4e8; }
        [data-theme="dark"] .nb-dd-item:hover { background: rgba(255,255,255,0.06); }
        [data-theme="dark"] .nb-dd-divider { background: rgba(255,255,255,0.10); }
        [data-theme="dark"] .nb-dd-name { color: #eef4e8; }
        [data-theme="dark"] .nb-dd-role { color: rgba(168,204,130,0.55); }
        [data-theme="dark"] .nb-dd-danger { color: #f87171; }
        [data-theme="dark"] .nb-dd-danger:hover { background: rgba(220,38,38,0.14); }
      `}</style>

      <div className="sticky top-0 z-30 px-5 py-3 pointer-events-none">
        <div className="nb-card pointer-events-auto flex items-center h-16 px-4 gap-3">

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors flex-shrink-0"
            style={{
              background: BRAND.green,
              boxShadow: `0 4px 14px ${BRAND.shadow}`,
              color: "#fff",
            }}
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Search */}
          <div
            className="nb-search-box flex items-center gap-2.5 rounded-2xl px-4 flex-shrink-0"
            style={{ width: "440px", height: "42px" }}
          >
            <Search className="nb-search-icon w-[15px] h-[15px] text-gray-400 flex-shrink-0" />
            <input
              id="nb-search-input"
              type="search"
              placeholder="Search…"
              className="bg-transparent outline-none text-[13.5px] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 w-full"
            />
          </div>

          <div className="flex-1" />

          {/* Theme toggle pill */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="nb-theme-pill hidden md:flex items-center justify-center w-[42px] h-[42px] rounded-full flex-shrink-0 text-white transition-all duration-150"
            style={{
              background: BRAND.green,
              boxShadow: `0 4px 14px ${BRAND.shadow}`,
            }}
          >
            {theme === "light" ? (
              <Moon className="w-[15px] h-[15px]" />
            ) : (
              <Sun className="w-[15px] h-[15px]" />
            )}
          </button>

          {/* User pill + dropdown */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              type="button"
              className="nb-user-pill flex items-center h-[42px] rounded-full px-3 text-white transition-all duration-150 border-none cursor-pointer"
              style={{
                background: BRAND.green,
                boxShadow: `0 4px 14px ${BRAND.shadow}`,
                gap: 0,
              }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {/* Bell */}
              <span
                className="relative flex items-center justify-center pr-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Bell className="w-4 h-4 text-white" />
                <span
                  className="absolute -top-0.5 right-1 w-[7px] h-[7px] rounded-full bg-amber-400 border-[1.5px]"
                  style={{ borderColor: BRAND.green }}
                />
              </span>

              {/* Divider */}
              <span className="w-px h-[22px] bg-white/25 mx-2.5 flex-shrink-0" />

              {/* Avatar */}
              <span className="w-[30px] h-[30px] rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                {initials || <UserCircle2 className="w-4 h-4" />}
              </span>

              {/* Name + role */}
              <span className="hidden sm:flex flex-col ml-2 mr-1 text-left gap-px">
                <span className="text-[13px] font-semibold text-white leading-tight whitespace-nowrap">
                  {adminName}
                </span>
                <span className="text-[10.5px] text-white/70 leading-none whitespace-nowrap">
                  {adminRole}
                </span>
              </span>

              {/* Chevron */}
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/80 ml-1.5 flex-shrink-0 transition-transform duration-150 ${menuOpen ? "nb-chevron-open" : ""
                  }`}
              />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                className="nb-dropdown nb-dropdown-wrap absolute right-0 mt-2.5 w-52 rounded-[18px] border shadow-xl overflow-hidden z-50"
                style={{
                  background: "#ffffff",
                  borderColor: "#e3ddd6",
                  boxShadow:
                    "0 16px 40px rgba(20,92,69,0.13), 0 2px 8px rgba(20,92,69,0.07)",
                }}
                role="menu"
              >
                {/* Header */}
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.green} 0%, ${BRAND.dark} 100%)`,
                    }}
                  >
                    {initials || <UserCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="nb-dd-name text-[13px] font-semibold text-gray-800 truncate">
                      {adminName}
                    </p>
                    <p className="nb-dd-role text-[11px] text-gray-400">{adminRole}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="p-1.5">
                  <button
                    type="button"
                    className="nb-dd-item flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/admin/settings");
                    }}
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 opacity-60" />
                    Account settings
                  </button>

                  <div className="nb-dd-divider h-px bg-gray-100 my-1" />

                  <button
                    type="button"
                    className="nb-dd-item nb-dd-danger flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? "Logging out…" : "Log out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
