"use client";

import BackToTop from "./BackToTop";
import InquiryWidget from "./FloatingInquiry";
import WhatsAppButton from "./WhatsAppButton";
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
      {/* overflow-x clipping lives HERE (a sibling of the sticky header), not
          on html/body — so nothing in the header's ancestor chain creates a
          scroll container that would break position:sticky. */}
      <main style={{ overflowX: "clip" }}>{children}</main>
      <Footer categories={categories} onInquiryOpen={openInquiryModal} />
      <BackToTop />
      <InquiryWidget />
      <WhatsAppButton />
      <BrochureModal />
    </div>
  );
}
