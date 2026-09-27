"use client";


import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type AdminLayoutProps = {
    children: React.ReactNode;
    adminName?: string;
    adminRole?: string;
    logoSrc?: string;
};

export default function AdminLayout({
    children,
    adminName = "Admin",
    adminRole = "Super Admin",
    logoSrc = "/logo.png",
}: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    /* Close drawer on desktop resize */
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setDrawerOpen(false); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* Lock body scroll while mobile drawer is open */
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [drawerOpen]);

    const openDrawer = useCallback(() => setDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const toggleCollapsed = useCallback(() => setSidebarCollapsed(v => !v), []);

    return (
        /*
         * The shell must fill the viewport height and NOT overflow — so the sidebar
         * stays fixed while only the main content area scrolls.
         */
        <div
            className="flex h-screen w-screen overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse 55% 40% at 0% 0%, rgba(90,140,60,0.05) 0%, transparent 60%), " +
                    "radial-gradient(ellipse 45% 35% at 100% 100%, rgba(200,146,42,0.04) 0%, transparent 60%), " +
                    "var(--background, #faf8f4)",
            }}
        >
            {/* ── Desktop Sidebar (sticky, never scrolls) ── */}
            <div className="hidden lg:flex shrink-0 h-full">
                <Sidebar />
            </div>

            {/* ── Mobile drawer backdrop ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 lg:hidden"
                        style={{ background: "rgba(20,35,14,0.45)", backdropFilter: "blur(3px)" }}
                        onClick={closeDrawer}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* ── Mobile drawer ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div
                        key="drawer"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 380, damping: 36 }}
                        className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
                        style={{ width: 240 }}
                    >
                        <Sidebar
                            onClose={closeDrawer}
                            mobileOpen={true}
                        />                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main column (navbar + scrollable content) ── */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                <Navbar onMenuClick={openDrawer} adminName={adminName} adminRole={adminRole} />

                {/* Only this area scrolls */}
                <main className="flex-1 overflow-y-auto" id="main-content">
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="p-4 sm:p-6 lg:p-8"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
