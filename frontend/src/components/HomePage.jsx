"use client";

import { useState } from "react";
import Hero from "./Hero";
import { Marquee } from "./Marquee";
import AboutSection from "./About";
import ProductCategories from "./Products";
import BestSellingProducts from "./Bestsellingproduct";
import WhyChooseUs from "./WhyChoose";
import IndustriesWeServe from "./IndustriesWeServe";
import OurLaboratory from "./Certifications";
import VideoSection from "./VideoSection";
import DocsSection from "./Docs";
import ProductionProcess from "./Process";
import OurInfrastructure from "./InfraSection";
import PrivateLabel from "./PrivateLabel";
import GlobalExport from "./GlobalExport";
import TestimonialsSection from "./Testimonials";
import Blog from "./Blog";
import CTASection from "./CTA";
import NewsletterSection from "./Newsletter";

function openInquiryModal() {
  window.dispatchEvent(new CustomEvent("open-inquiry"));
}

export default function HomePage({ categories = [] }) {
  return (
    <>
      <Hero onOpenInquiry={openInquiryModal} />
      <Marquee />
      <AboutSection />
      <ProductCategories
        categories={categories}
        onOpenInquiry={openInquiryModal}
      />
      <BestSellingProducts />
      <WhyChooseUs />
      <IndustriesWeServe />
      <OurLaboratory />
      <VideoSection />
      <DocsSection />
      <ProductionProcess />
      <OurInfrastructure />
      <PrivateLabel />
      <GlobalExport />
      <TestimonialsSection />
      <Blog />
      <CTASection />
      <NewsletterSection />
    </>
  );
}
