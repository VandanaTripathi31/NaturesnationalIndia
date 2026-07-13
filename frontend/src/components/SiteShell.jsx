"use client";

import BackToTop from "./BackToTop";
import InquiryWidget from "./FloatingInquiry";
import BrochureModal from "./BrochureModal";
import Footer from "./Footer";
import Navbar from "./Navbar";

function openInquiryModal() {
  window.dispatchEvent(new CustomEvent("open-inquiry"));
}

export default function SiteShell({ children, categories = [] }) {
  return (
    <div className="min-h-screen bg-[#faf6ee] text-[#3a2c1a] font-outfit">
      <Navbar categories={categories} onOpenInquiry={openInquiryModal} />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <InquiryWidget />
      <BrochureModal />
    </div>
  );
}
