"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingInquiry from "@/components/FloatingInquiry";

function openInquiryModal() {
  window.dispatchEvent(new CustomEvent("open-inquiry"));
}

export default function SiteShell({ children, categories = [] }) {
  return (
    <div className="min-h-screen bg-[#faf6ee] text-[#3a2c1a] font-outfit">
      <Navbar categories={categories} onOpenInquiry={openInquiryModal} />
      <main>{children}</main>
      <Footer />
      <FloatingInquiry />
    </div>
  );
}
