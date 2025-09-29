"use client";
import React, { Fragment } from "react";

// --- Type Imports ---

// --- Data Imports ---
import { categories, products } from "../../../data";
import NoticeBar from "@/components/layout/NoticeBar";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/NewsletterSection";

// --- Components ---

// --- Main App Component ---
// This would be your `app/page.jsx` in a Next.js 15 project.
export default function EcommerceLandingPage() {
  return (
    <>
      <div
        dir="rtl"
        className="bg-white"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <NoticeBar />
        <Header />
        <main>
          <HeroSection />
          <CategoriesSection categories={categories} />
          <ProductSection
            title="مجموعاتنا الأكثر طلبا"
            subtitle="استكشفي المنتجات التي حازت على أعلى تقييمات من عملائنا."
            products={products.slice(0, 4)}
            bgColor="bg-stone-50"
          />
          <ProductSection
            title="تشكيلة منتجاتنا المميزة"
            subtitle="تصفحي تشكيلتنا المختارة من المنتجات الطبيعية التي نالت ثقة عملائنا."
            products={products.slice(0, 10)}
            showButton={true}
            bgColor="bg-white"
          />
        </main>
        <NewsletterSection />
        <Footer />
      </div>
    </>
  );
}
