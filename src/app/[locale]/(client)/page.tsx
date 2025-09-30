"use client";
import React, { Fragment } from "react";

import { categories, products } from "../../../data";
import NoticeBar from "@/components/layout/NoticeBar";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { WhatsAppFloatingButton } from "@/components/ui";

export default function EcommerceLandingPage() {
  return (
    <>
      <div
        dir="rtl"
        className="bg-white"
        // style={{ fontFamily: "'Cairo', sans-serif" }}
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

        {/* WhatsApp Floating Button */}
        <WhatsAppFloatingButton
          phoneNumber="212612345678" // Replace with your actual phone number
          message="مرحبا، أريد الاستفسار عن منتجاتكم الطبيعية"
        />
      </div>
    </>
  );
}
