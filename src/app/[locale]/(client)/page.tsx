/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";

import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductSection from "@/components/ProductSection";
import NewsletterSection from "@/components/NewsletterSection";
import { WhatsAppFloatingButton } from "@/components/ui";
import { getCategories } from "@/lib/services/productService";
import { getLandingPageSectionsWithProducts } from "@/lib/services/sectionService";
import { CACHE_CONFIG } from "@/lib/cache/tags";
import { Locale } from "@/types/common";
import { Language } from "firebase/ai";
import { Category, Product } from "@/types";
import { siteConfig } from "@/config/site";

// ISR Configuration - Revalidate every week (604800 seconds = 7 days)
export const revalidate = 604800;

// More efficient helper to serialize only Timestamp fields in products
const serializeProductTimestamps = (products: any[]) => {
  return products.map((product) => {
    const newProduct = { ...product };
    if (product.createdAt && typeof product.createdAt.toDate === "function") {
      newProduct.createdAt = product.createdAt.toDate().toISOString();
    }
    if (product.updatedAt && typeof product.updatedAt.toDate === "function") {
      newProduct.updatedAt = product.updatedAt.toDate().toISOString();
    }
    return newProduct;
  });
};

// Generate static params for supported locales
export async function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "fr" }];
}

// Generate SEO metadata for the landing page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  // Cache the data for metadata generation - only what we need
  const categories = await getCachedCategories();
  const landingPageSections = await getCachedLandingPageSections();

  // Extract products from landing page sections (much lighter than getAllProducts)
  const landingPageProducts = landingPageSections
    .flatMap((section) => section.products || [])
    .slice(0, 10); // Limit to first 10 for SEO

  const isArabic = typedLocale === "ar";

  // Dynamic content for SEO using only landing page products
  const featuredProductNames = landingPageProducts
    .slice(0, 5)
    .map(
      (p) =>
        p.name?.[typedLocale] ||
        p.name?.ar ||
        p.name?.fr ||
        `${siteConfig.brandName} Product`
    );

  const categoryNames = categories
    .slice(0, 4)
    .map(
      (c) => c.name?.[typedLocale] || c.name?.ar || c.name?.fr || "Category"
    );
  const seoContent = {
    ar: {
      title: `${siteConfig.name} - ${featuredProductNames
        .slice(0, 3)
        .join(" | ")} | ${siteConfig.niche.ar}`,
      description: `${siteConfig.description.ar} ${featuredProductNames.join(
        ", "
      )}. ${categoryNames.join(", ")}.`,
      keywords: [
        ...siteConfig.keywords.ar,
        ...featuredProductNames,
        ...categoryNames,
      ],
    },
    fr: {
      title: `${siteConfig.name} - ${featuredProductNames
        .slice(0, 3)
        .join(" | ")} | ${siteConfig.niche.fr}`,
      description: `${siteConfig.description.fr} ${featuredProductNames.join(
        ", "
      )}. ${categoryNames.join(", ")}.`,
      keywords: [
        ...siteConfig.keywords.fr,
        ...featuredProductNames,
        ...categoryNames,
      ],
    },
  };

  const content = seoContent[typedLocale];

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    openGraph: {
      type: "website",
      locale: isArabic ? "ar_MA" : "fr_MA",
      alternateLocale: isArabic ? "fr_MA" : "ar_MA",
      url: `${siteConfig.url}/${typedLocale}`,
      siteName: siteConfig.name,
      title: content.title,
      description: content.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: content.title,
        },
        // Add featured product images
        ...landingPageProducts.slice(0, 3).map((product) => ({
          url: product.image || siteConfig.ogImage,
          width: 800,
          height: 600,
          alt: product.name?.[typedLocale] || `${siteConfig.brandName} Product`,
        })),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [landingPageProducts[0]?.image || siteConfig.ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/${typedLocale}`,
      languages: {
        "ar-MA": `${siteConfig.url}/ar`,
        "fr-MA": `${siteConfig.url}/fr`,
      },
    },
    other: {
      "product:count": landingPageProducts.length.toString(),
      "category:count": categories.length.toString(),
      "last-modified": new Date().toISOString(),
    },
  };
}

// Cache the data fetching functions
const getCachedCategories = unstable_cache(
  async () => {
    console.log(`[CACHE] Fetching categories at ${new Date().toISOString()}`);
    return getCategories();
  },
  CACHE_CONFIG.CATEGORIES.key,
  {
    revalidate: CACHE_CONFIG.CATEGORIES.revalidate,
    tags: CACHE_CONFIG.CATEGORIES.tags,
  }
);

const getCachedLandingPageSections = unstable_cache(
  async () => {
    console.log(
      `[CACHE] Fetching landing page sections at ${new Date().toISOString()}`
    );
    return getLandingPageSectionsWithProducts();
  },
  CACHE_CONFIG.SECTIONS.key,
  {
    revalidate: CACHE_CONFIG.SECTIONS.revalidate,
    tags: CACHE_CONFIG.SECTIONS.tags,
  }
);

type Props = {
  params: Promise<{ locale: Language }>;
};

export default async function EcommerceLandingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const categoriesData = await getCachedCategories();
  const landingPageSectionsData = await getCachedLandingPageSections();

  // Use the more efficient serialization function
  const landingPageSections = landingPageSectionsData.map((section: any) => ({
    ...section,
    products: section.products
      ? serializeProductTimestamps(section.products)
      : [],
  }));

  // Categories likely don't have timestamps, but if they do, you can serialize them too
  const categories = categoriesData;

  // Extract products from landing page sections only
  const landingPageProducts = landingPageSections.flatMap(
    (section: any) => section.products || []
  );

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    description: siteConfig.description[locale as "ar" | "fr"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/${locale}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
        width: 400,
        height: 400,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.whatsapp,
        contactType: "customer service",
        availableLanguage: siteConfig.i18n.locales,
      },
      sameAs: [
        siteConfig.socialLinks.facebook,
        siteConfig.socialLinks.instagram,
        siteConfig.socialLinks.twitter,
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: locale === "ar" ? "المنتجات المميزة" : "Produits en vedette",
      numberOfItems: landingPageProducts.length,
      itemListElement: landingPageProducts
        .slice(0, 10)
        .map((product: Product, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            "@id": `${siteConfig.url}/${locale}/products/${product.id}`,
            name:
              product.name?.[locale as "ar" | "fr"] ||
              product.name?.ar ||
              product.name?.fr,
            description:
              product.description?.[locale as "ar" | "fr"] ||
              product.description?.ar ||
              product.description?.fr,
            image: product.image || `${siteConfig.url}${siteConfig.ogImage}`,
            brand: {
              "@type": "Brand",
              name: siteConfig.brandName,
            },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "MAD",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: siteConfig.name,
              },
            },
          },
        })),
    },
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ar" ? "الرئيسية" : "Accueil",
        item: `${siteConfig.url}/${locale}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div
        className="bg-white"
        // style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        {/* SEO-friendly main content wrapper */}
        <main
          role="main"
          aria-label={locale === "ar" ? "المحتوى الرئيسي" : "Contenu principal"}
        >
          {/* Hero Section with SEO optimization */}
          <section
            aria-label={
              locale === "ar" ? "القسم الرئيسي" : "Section principale"
            }
          >
            <HeroSection />
          </section>

          {/* Categories Section with SEO structure */}
          <section
            aria-label={
              locale === "ar" ? "فئات المنتجات" : "Catégories de produits"
            }
            className="categories-section"
          >
            <h2 className="sr-only">
              {locale === "ar"
                ? "تصفح فئات المنتجات"
                : "Parcourir les catégories de produits"}
            </h2>
            <CategoriesSection categories={categories} />
          </section>

          {/* Dynamic Product Sections from Firebase - Landing Page Type Only */}
          {landingPageSections.length > 0 && (
            <section
              aria-label={
                locale === "ar" ? "المنتجات المميزة" : "Produits en vedette"
              }
              className="featured-products-sections"
            >
              <h2 className="sr-only">
                {locale === "ar"
                  ? "مجموعات المنتجات المميزة"
                  : "Collections de produits en vedette"}
              </h2>
              {landingPageSections.map((section: any, index: number) => {
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
                  <article
                    key={section.id}
                    className="product-section-wrapper"
                    itemScope
                    itemType="https://schema.org/CollectionPage"
                  >
                    <meta itemProp="name" content={sectionTitle} />
                    <meta itemProp="description" content={sectionSubtitle} />
                    <ProductSection
                      title={sectionTitle}
                      subtitle={sectionSubtitle}
                      products={section.products}
                      bgColor={index % 2 === 0 ? "bg-stone-50" : "bg-white"}
                      showButton={section.products.length > 6}
                    />
                  </article>
                );
              })}
            </section>
          )}

          {/* Fallback: Show static sections if no dynamic sections available */}
          {landingPageSections.length === 0 && (
            <section
              aria-label={
                locale === "ar" ? "المنتجات المقترحة" : "Produits recommandés"
              }
              className="fallback-products-sections"
            >
              <h2 className="sr-only">
                {locale === "ar"
                  ? "منتجاتنا المقترحة"
                  : "Nos produits recommandés"}
              </h2>
              <article
                className="popular-products"
                itemScope
                itemType="https://schema.org/CollectionPage"
              >
                <meta itemProp="name" content={t("popularProducts.title")} />
                <meta
                  itemProp="description"
                  content={t("popularProducts.subtitle")}
                />
                <ProductSection
                  title={t("popularProducts.title")}
                  subtitle={t("popularProducts.subtitle")}
                  products={landingPageProducts.slice(0, 4)}
                  bgColor="bg-stone-50"
                />
              </article>
              <article
                className="featured-products"
                itemScope
                itemType="https://schema.org/CollectionPage"
              >
                <meta itemProp="name" content={t("featuredProducts.title")} />
                <meta
                  itemProp="description"
                  content={t("featuredProducts.subtitle")}
                />
                <ProductSection
                  title={t("featuredProducts.title")}
                  subtitle={t("featuredProducts.subtitle")}
                  products={landingPageProducts.slice(0, 10)}
                  showButton={true}
                  bgColor="bg-white"
                />
              </article>
            </section>
          )}
        </main>

        {/* Newsletter Section with SEO optimization */}
        <aside
          role="complementary"
          aria-label={locale === "ar" ? "النشرة البريدية" : "Newsletter"}
          className="newsletter-section"
        >
          <NewsletterSection />
        </aside>

        {/* WhatsApp Floating Button with accessibility */}
        <div
          role="region"
          aria-label={
            locale === "ar" ? "التواصل عبر واتساب" : "Contact WhatsApp"
          }
          className="whatsapp-contact"
        >
          <WhatsAppFloatingButton
            phoneNumber={siteConfig.contact.whatsapp}
            message={t("whatsappMessage")}
          />
        </div>

        {/* Hidden SEO content for better indexing */}
        <div className="sr-only" aria-hidden="true">
          <h2>
            {locale === "ar"
              ? "معلومات إضافية عن هيوامي"
              : "Informations supplémentaires sur Huyamy"}
          </h2>
          <p>
            {locale === "ar"
              ? `متجر ${siteConfig.name} يوفر ${landingPageProducts.length} منتج طبيعي مغربي مميز عبر ${categories.length} فئة مختلفة. نحن متخصصون في ${siteConfig.niche.ar}.`
              : `La boutique ${siteConfig.name} propose ${landingPageProducts.length} produits naturels marocains en vedette dans ${categories.length} catégories différentes. Nous sommes spécialisés dans les ${siteConfig.niche.fr}.`}
          </p>
          {categories.map((category: Category, index: number) => (
            <span key={category.id}>
              {category.name?.[locale as "ar" | "fr"]}
              {index < categories.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
