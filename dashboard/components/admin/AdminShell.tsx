"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type AdminShellProps = {
  children: React.ReactNode;
  adminName?: string;
};

export default function AdminShell({ children, adminName }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* ══ Sidebar — handles desktop (sticky) and mobile (drawer) internally ══ */}
      <Sidebar
        mobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ══ Main content area ══ */}
      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        <Navbar
          adminName={adminName}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
