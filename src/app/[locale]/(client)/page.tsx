import React, { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";

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

// Cache the data fetching functions
const getCachedProducts = unstable_cache(
  async () => {
    console.log(`[CACHE] Fetching products at ${new Date().toISOString()}`);
    return getAllProducts();
  },
  ["products"],
  {
    revalidate: 604800, // 7 days
    tags: ["products", "landing-page"],
  }
);

const getCachedCategories = unstable_cache(
  async () => {
    console.log(`[CACHE] Fetching categories at ${new Date().toISOString()}`);
    return getCategories();
  },
  ["categories"],
  {
    revalidate: 604800, // 7 days
    tags: ["categories", "landing-page"],
  }
);

const getCachedLandingPageSections = unstable_cache(
  async () => {
    console.log(
      `[CACHE] Fetching landing page sections at ${new Date().toISOString()}`
    );
    return getLandingPageSectionsWithProducts();
  },
  ["landing-page-sections"],
  {
    revalidate: 604800, // 7 days
    tags: ["sections", "landing-page"],
  }
);

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EcommerceLandingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const products = await getCachedProducts();
  const categories = await getCachedCategories();
  const landingPageSections = await getCachedLandingPageSections();

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
