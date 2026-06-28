import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Products from "./components/Products.jsx";
import WhyChoose from "./components/WhyChoose.jsx";
import Certifications from "./components/Certifications.jsx";
import VideoSection from "./components/VideoSection.jsx";
import Docs from "./components/Docs.jsx";
import Process from "./components/Process.jsx";
import PrivateLabel from "./components/PrivateLabel.jsx";
import GlobalExport from "./components/GlobalExport.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Blog from "./components/Blog.jsx";
import CTA from "./components/CTA.jsx";
import Newsletter from "./components/Newsletter.jsx";
import Footer from "./components/Footer.jsx";
import { Marquee } from "./components/Marquee.jsx";
import BestSellingProducts from "./components/Bestsellingproduct.jsx";
import IndustriesWeServe from "./components/IndustriesWeServe.jsx";
import InquiryWidget from "./components/FloatingInquiry.jsx";
import OurInfrastructure from "./components/InfraSection.jsx";
import EssentialOilsListingPage from "./Pages/EssentialOilsPage.jsx";
import ShippingPage from "./Pages/Shipping.jsx";
import Contact from "./Pages/ContactUs.jsx";
import OurCertifications from "./Pages/OurCertification.jsx";
import QualityAssurance from "./Pages/QualityAssurance.jsx";
import CategoryPage from "./Pages/CategoryPage.jsx";
import ProductPage from "./Pages/ProductPage.jsx";

// Import your detail page

const HomePage = ({ openInquiry }) => {
  return (
    <>
      <Hero onOpenInquiry={openInquiry} />
      <Marquee />
      <About />
      <Products onOpenInquiry={openInquiry} />
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
};

const App = () => {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const openInquiry = () => setIsInquiryOpen(true);
  const closeInquiry = () => setIsInquiryOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-[#faf6ee] text-[#3a2c1a] font-outfit">
        <Navbar onOpenInquiry={openInquiry} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage openInquiry={openInquiry} />} />

            <Route
              path="/products/essential-oils"
              element={<EssentialOilsListingPage />}
            />
            <Route path="/delivery-info" element={<ShippingPage />} />
            <Route path="/quality-assurance" element={<QualityAssurance />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/our-certification" element={<OurCertifications />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>
        </main>

        <Footer />
        <InquiryWidget />
      </div>
    </Router>
  );
};

export default App;
