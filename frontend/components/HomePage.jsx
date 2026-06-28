"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import About from "@/components/About";
import Products from "@/components/Products";
import BestSellingProducts from "@/components/Bestsellingproduct";
import WhyChoose from "@/components/WhyChoose";
import IndustriesWeServe from "@/components/IndustriesWeServe";
import Certifications from "@/components/Certifications";
import VideoSection from "@/components/VideoSection";
import Docs from "@/components/Docs";
import Process from "@/components/Process";
import OurInfrastructure from "@/components/InfraSection";
import PrivateLabel from "@/components/PrivateLabel";
import GlobalExport from "@/components/GlobalExport";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import CTA from "@/components/CTA";
import Newsletter from "@/components/Newsletter";

function openInquiryModal() {
  window.dispatchEvent(new CustomEvent("open-inquiry"));
}

export default function HomePage() {
  return (
    <>
      <Hero onOpenInquiry={openInquiryModal} />
      <Marquee />
      <About />
      <Products onOpenInquiry={openInquiryModal} />
      <BestSellingProducts />
      <WhyChoose />
      <IndustriesWeServe />
      <Certifications />
      <VideoSection />
      <Docs />
      <Process />
      <OurInfrastructure />
      <PrivateLabel />
      <GlobalExport />
      <Testimonials />
      <Blog />
      <CTA />
      <Newsletter />
    </>
  );
}
