// OrganicMandyaPage.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { Helmet } from "react-helmet";

import "./OrganicPage.css";
import AboutUsPage from "./AboutUsPage";
import TestimonialPage from "./TestimonialPage";
import GalleryPage from "./GalleryPage";
import Footer from "./Footer";
import Videos from "./Videos";
import Certifications from "./Certifications";
import WhyChooseOrganicTattva from "./WhyChooseOrganicTattva";
import ProductDetailPage from "./ProductDetailPage";
import Categories from "./Categories";
import Products from "./Products";
import Header from "./Header";
import Hero from "./Hero";
import Success from "./Success";

// ================= WhatsApp =================
export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/7259323346"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}

// ================= Pages =================
function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <Products showPopularOnly={true} />
      <WhyChooseOrganicTattva />
      <Certifications />
      <Videos />

      <Footer />
      <WhatsAppButton />
    </>
  );
}

function CategoryPage() {
  return (
    <>
      <Header />
      <Products />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

// Main export
export default function OrganicPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:productName" element={<ProductDetailPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/testimonial" element={<TestimonialPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}
