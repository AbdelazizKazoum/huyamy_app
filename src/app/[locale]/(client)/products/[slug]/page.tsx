/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { Language, Product, Section } from "@/types";
import { unstable_cache } from "next/cache";
import { getProductBySlug } from "@/lib/services/productService";
import { CACHE_CONFIG } from "@/lib/cache/tags";
import { siteConfig } from "@/config/site";
import ProductDisplay from "@/components/ProductDisplay"; // <-- Import the new display component
import { getSectionsByType } from "@/lib/services/sectionService";

type Props = {
  params: Promise<{ locale: Language; slug: string }>;
};

// Serialize product data to remove Firestore objects
const serializeProduct = (product: any): Product => {
  return {
    ...product,
    createdAt: product.createdAt?.toDate?.()
      ? product.createdAt.toDate().toISOString()
      : product.createdAt,
    updatedAt: product.updatedAt?.toDate?.()
      ? product.updatedAt.toDate().toISOString()
      : product.updatedAt,
    // If category also has timestamp fields, serialize them too
    category: product.category
      ? {
          ...product.category,
          createdAt: product.category.createdAt?.toDate?.()
            ? product.category.createdAt.toDate().toISOString()
            : product.category.createdAt,
          updatedAt: product.category.updatedAt?.toDate?.()
            ? product.category.updatedAt.toDate().toISOString()
            : product.category.updatedAt,
        }
      : product.category,
  };
};

// Example: Serialize section timestamps
function serializeSection(section: any): Section {
  return {
    ...section,
    createdAt: section.createdAt?.toDate?.()
      ? section.createdAt.toDate().toISOString()
      : section.createdAt,
    updatedAt: section.updatedAt?.toDate?.()
      ? section.updatedAt.toDate().toISOString()
      : section.updatedAt,
    // Add similar logic for nested objects if needed
  };
}

// Cache the product fetching function
const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    console.log(`[CACHE] Fetching product detail for slug: ${slug}`);
    const rawProduct = await getProductBySlug(slug);
    console.log("🚀 ~ rawProduct:", rawProduct);

    return rawProduct ? serializeProduct(rawProduct) : null;
  },
  [CACHE_CONFIG.PRODUCT_DETAIL.key[0]], // Base cache key
  {
    revalidate: CACHE_CONFIG.PRODUCT_DETAIL.revalidate,
    // Tags are now added dynamically inside the function if needed,
    // but for this use case, slug-specific tags are better handled
    // by revalidateTag.
    // The slug-specific tag is added below for clarity.
    tags: CACHE_CONFIG.PRODUCT_DETAIL.tags,
  }
);

// Cache the "also-choose" sections fetching function
const getCachedSectionsByType = unstable_cache(
  async (type: string) => {
    const rawSections = await getSectionsByType(type);
    return rawSections.map(serializeSection);
  },
  ["also-choose-sections"], // Cache key
  {
    revalidate: CACHE_CONFIG.PRODUCT_DETAIL.revalidate,
    tags: CACHE_CONFIG.PRODUCT_DETAIL.tags,
  }
);

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  // Get cached product data for metadata
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    return {
      title: {
        template: siteConfig.titleTemplate,
        default: locale === "ar" ? "منتج غير موجود" : "Produit non trouvé",
      },
      description:
        locale === "ar"
          ? `المنتج المطلوب غير متوفر. تصفح مجموعتنا من منتجات ${siteConfig.niche.ar} المميزة.`
          : `Le produit demandé n'est pas disponible. Découvrez notre collection de ${siteConfig.niche.fr} exceptionnels.`,
      robots: "noindex, nofollow",
    };
  }

  const currency = siteConfig.currencies[locale];
  const productName = product.name[locale];
  const productDescription = product.description[locale];
  const categoryName = product.category?.name?.[locale] || "";

  // Create rich SEO titles
  const titles = {
    ar: `${productName} | ${categoryName} | ${siteConfig.name} - ${siteConfig.niche.ar}`,
    fr: `${productName} | ${categoryName} | ${siteConfig.name} - ${siteConfig.niche.fr}`,
  };

  // Create rich SEO descriptions
  const descriptions = {
    ar: `اشتري ${productName} بأفضل سعر ${product.price} ${currency}. ${productDescription}. توصيل مجاني، دفع عند الاستلام. منتجات أصلية 100% من ${siteConfig.name}.`,
    fr: `Achetez ${productName} au meilleur prix ${product.price} ${currency}. ${productDescription}. Livraison gratuite, paiement à la livraison. Produits 100% authentiques de ${siteConfig.name}.`,
  };

  // Generate keywords
  const keywords = [
    productName,
    categoryName,
    ...siteConfig.keywords[locale],
    ...product.keywords,
  ].filter(Boolean);

  const productUrl = `${siteConfig.baseUrl}/${locale}/products/${slug}`;

  // Generate alternate language URLs
  const alternateLanguages = {
    ar: `${siteConfig.baseUrl}/ar/products/${slug}`,
    fr: `${siteConfig.baseUrl}/fr/products/${slug}`,
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    keywords: keywords.join(", "),

    // Open Graph for social media
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: productUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: locale === "ar" ? "ar_MA" : "fr_FR",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: productName,
          type: "image/jpeg",
        },
        ...product.subImages.slice(0, 3).map((img, index) => ({
          url: img,
          width: 800,
          height: 600,
          alt: `${productName} - صورة ${index + 2}`,
          type: "image/jpeg",
        })),
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      site: siteConfig.social.twitter,
      creator: siteConfig.social.twitter,
      title: titles[locale],
      description: descriptions[locale],
      images: [product.image],
    },

    // Additional meta tags
    other: {
      // Product-specific meta tags
      "product:price:amount": product.price.toString(),
      "product:price:currency": currency,
      "product:availability": "in stock",
      "product:condition": "new",
      "product:brand": siteConfig.brandName,
      "product:category": categoryName,

      // E-commerce specific
      "og:price:amount": product.price.toString(),
      "og:price:currency": currency,
      "og:availability": "instock",

      // Internationalization
      "og:locale": locale === "ar" ? "ar_MA" : "fr_FR",
      "og:locale:alternate": locale === "ar" ? "fr_FR" : "ar_MA",

      // Additional SEO tags
      robots: "index, follow, max-image-preview:large",
      googlebot: "index, follow",
      author: siteConfig.authors.map((a) => a.name).join(", "),
      publisher: siteConfig.publisher,
      "theme-color": siteConfig.themeColor,

      // Mobile optimization
      "format-detection": "telephone=yes",
      "mobile-web-app-capable": "yes",
    },

    // Canonical URL
    alternates: {
      canonical: productUrl,
      languages: {
        ar: alternateLanguages.ar,
        fr: alternateLanguages.fr,
        "x-default": alternateLanguages[siteConfig.i18n.defaultLocale],
      },
    },

    // Verification tags
    verification: {
      google: siteConfig.verification.google,
    },

    // Manifest for PWA
    manifest: siteConfig.manifest,
  };
}

// JSON-LD Structured Data Component
function ProductStructuredData({
  product,
  locale,
  currency,
}: {
  product: Product;
  locale: Language;
  currency: string;
}) {
  const baseOffer = {
    "@type": "Offer",
    priceCurrency: currency === "د.م." ? "MAD" : "MAD",
    price: product.price.toString(),
    availability: "https://schema.org/InStock",
    url: `${siteConfig.baseUrl}/${locale}/products/${product.slug}`,
    seller: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    itemCondition: "https://schema.org/NewCondition",
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    description: product.description[locale],
    image: [product.image, ...product.subImages],
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: siteConfig.brandName,
    },
    category: product.category?.name?.[locale],
    offers: product.originalPrice
      ? {
          ...baseOffer,
          "@type": "AggregateOffer",
          lowPrice: product.price.toString(),
          highPrice: product.originalPrice.toString(),
          offerCount: "1",
        }
      : baseOffer,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "127",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: locale === "ar" ? "زبون راضي" : "Client Satisfait",
        },
        reviewBody:
          locale === "ar"
            ? "منتج ممتاز وجودة عالية، أنصح به بشدة"
            : "Produit excellent et de haute qualité, je le recommande vivement",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

// Breadcrumb Structured Data
function BreadcrumbStructuredData({
  product,
  locale,
}: {
  product: Product;
  locale: Language;
}) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ar" ? "الرئيسية" : "Accueil",
        item: `${siteConfig.baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "ar" ? "المنتجات" : "Produits",
        item: `${siteConfig.baseUrl}/${locale}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category?.name?.[locale] || "",
        item: `${siteConfig.baseUrl}/${locale}/categories/${product.category?.id}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name[locale],
        item: `${siteConfig.baseUrl}/${locale}/products/${product.slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData, null, 2),
      }}
    />
  );
}

// Main Page Component
export default async function ProductDetailsPage({ params }: Props) {
  const { locale, slug } = await params;
  const currency = siteConfig.currencies[locale];

  // Get cached product data
  const product = await getCachedProductBySlug(slug);

  // Handle product not found
  if (!product) {
    notFound();
  }

  // Get "also-choose" section with ISR
  const alsoChooseSections = await getCachedSectionsByType("also-choose");

  return (
    <>
      {/* Structured Data */}
      <ProductStructuredData
        product={product}
        locale={locale}
        currency={currency}
      />
      <BreadcrumbStructuredData product={product} locale={locale} />

      {/* Pass alsoChooseSections to ProductDisplay */}
      <ProductDisplay
        product={product}
        locale={locale}
        alsoChooseSections={alsoChooseSections}
      />
    </>
  );
}
