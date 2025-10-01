import React, { Fragment } from "react";
import { useTranslations } from "next-intl";

import { categories, products } from "../../../data";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductSection from "@/components/ProductSection";
import NewsletterSection from "@/components/NewsletterSection";
import { WhatsAppFloatingButton } from "@/components/ui";

export default function EcommerceLandingPage() {
  const t = useTranslations("home");

  return (
    <>
      <div
        className="bg-white"
        // style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <main>
          <HeroSection />
          <CategoriesSection categories={categories} />
          <ProductSection
            title={t("popularProducts.title")}
            subtitle={t("popularProducts.subtitle")}
            products={products.slice(0, 4)}
            bgColor="bg-stone-50"
          />
          <ProductSection
            title={t("featuredProducts.title")}
            subtitle={t("featuredProducts.subtitle")}
            products={products.slice(0, 10)}
            showButton={true}
            bgColor="bg-white"
          />
        </main>
        <NewsletterSection />

        {/* WhatsApp Floating Button */}
        <WhatsAppFloatingButton
          phoneNumber="212636739071" // Replace with your actual phone number
          message={t("whatsappMessage")}
        />
      </div>
    </>
  );
}
