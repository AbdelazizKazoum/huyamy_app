import React, { Fragment } from "react";
import { getTranslations } from "next-intl/server";

import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductSection from "@/components/ProductSection";
import NewsletterSection from "@/components/NewsletterSection";
import { WhatsAppFloatingButton } from "@/components/ui";
import { getAllProducts, getCategories } from "@/lib/services/productService";
import { getLandingPageSectionsWithProducts } from "@/lib/services/sectionService";

// ISR Configuration - Revalidate every week (604800 seconds = 7 days)
export const revalidate = 604800;

// Generate static params for supported locales
export async function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "fr" }];
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EcommerceLandingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const products = await getAllProducts(); // runs on server
  const categories = await getCategories(); // fetch categories from Firebase

  // Get only landing-page type sections with their products
  const landingPageSections = await getLandingPageSectionsWithProducts();

  return (
    <>
      <div
        className="bg-white"
        // style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <main>
          <HeroSection />
          <CategoriesSection categories={categories} />

          {/* Dynamic Product Sections from Firebase - Landing Page Type Only */}
          {landingPageSections.map((section, index) => {
            // Only render ProductSection if the section has products
            if (!section.products || section.products.length === 0) {
              return null;
            }

            const sectionTitle =
              section.data.title?.[locale as "ar" | "fr"] ||
              `Section ${section.id}`;
            const sectionSubtitle =
              section.data.subtitle?.[locale as "ar" | "fr"] || "";

            return (
              <ProductSection
                key={section.id}
                title={sectionTitle}
                subtitle={sectionSubtitle}
                products={section.products}
                bgColor={index % 2 === 0 ? "bg-stone-50" : "bg-white"}
                showButton={section.products.length > 6}
              />
            );
          })}

          {/* Fallback: Show static sections if no dynamic sections available */}
          {landingPageSections.length === 0 && (
            <>
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
            </>
          )}
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
