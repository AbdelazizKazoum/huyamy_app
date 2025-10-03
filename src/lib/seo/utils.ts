// lib/seo/utils.ts
// SEO utilities for dynamic content optimization

import { Product, Category } from "@/types";
import { Locale } from "@/types/common";

/**
 * Generate SEO-friendly product list for meta descriptions
 */
export function generateProductListForSEO(
  products: Product[],
  locale: Locale,
  maxProducts: number = 5
): string {
  return products
    .slice(0, maxProducts)
    .map(
      (product) =>
        product.name?.[locale] ||
        product.name?.ar ||
        product.name?.fr ||
        "Huyamy Product"
    )
    .join(", ");
}

/**
 * Generate dynamic SEO keywords from products and categories
 */
export function generateDynamicKeywords(
  products: Product[],
  categories: Category[],
  locale: Locale,
  baseKeywords: string[] = []
): string[] {
  const productKeywords = products
    .slice(0, 10)
    .map(
      (product) =>
        product.name?.[locale] || product.name?.ar || product.name?.fr
    )
    .filter(Boolean);

  const categoryKeywords = categories
    .map(
      (category) =>
        category.name?.[locale] || category.name?.ar || category.name?.fr
    )
    .filter(Boolean);

  return [...baseKeywords, ...productKeywords, ...categoryKeywords].filter(
    Boolean
  ) as string[];
}

/**
 * Generate structured data for product collection
 */
export function generateProductCollectionStructuredData(
  products: Product[],
  locale: Locale,
  collectionName: string,
  collectionUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collectionName,
    url: collectionUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          "@id": `https://huyamy.com/${locale}/products/${product.id}`,
          name: product.name?.[locale] || product.name?.ar || product.name?.fr,
          description:
            product.description?.[locale] ||
            product.description?.ar ||
            product.description?.fr,
          image: product.image || "https://huyamy.com/images/huyami_logo.jpeg",
          brand: {
            "@type": "Brand",
            name: "Huyamy",
          },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "MAD",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "Huyamy",
            },
          },
        },
      })),
    },
  };
}

/**
 * Generate Open Graph images array from products
 */
export function generateOGImages(
  products: Product[],
  locale: Locale,
  maxImages: number = 4
) {
  const defaultImage = {
    url: "/images/huyami_logo.jpeg",
    width: 1200,
    height: 630,
    alt: "Huyamy - Produits Marocains Bio",
  };

  if (products.length === 0) {
    return [defaultImage];
  }

  const productImages = products
    .slice(0, maxImages)
    .filter((product) => product.image)
    .map((product) => ({
      url: product.image!,
      width: 800,
      height: 600,
      alt:
        product.name?.[locale] ||
        product.name?.ar ||
        product.name?.fr ||
        "Huyamy Product",
    }));

  return [defaultImage, ...productImages];
}

/**
 * Generate SEO-optimized title based on products and locale
 */
export function generateSEOTitle(
  products: Product[],
  categories: Category[],
  locale: Locale,
  baseTitle?: string
): string {
  const featuredProducts = products
    .slice(0, 3)
    .map((p) => p.name?.[locale] || p.name?.ar || p.name?.fr)
    .filter(Boolean);

  if (locale === "ar") {
    const title = baseTitle || "متجر هيوامي";
    return featuredProducts.length > 0
      ? `${title} - ${featuredProducts.join(
          " | "
        )} | منتجات مغربية طبيعية وعضوية`
      : `${title} | منتجات مغربية طبيعية وعضوية`;
  } else {
    const title = baseTitle || "Boutique Huyamy";
    return featuredProducts.length > 0
      ? `${title} - ${featuredProducts.join(" | ")} | Produits Marocains Bio`
      : `${title} | Produits Marocains Bio`;
  }
}

/**
 * Generate SEO-optimized description
 */
export function generateSEODescription(
  products: Product[],
  categories: Category[],
  locale: Locale
): string {
  const productList = generateProductListForSEO(products, locale, 5);
  const categoryList = categories
    .slice(0, 4)
    .map((c) => c.name?.[locale] || c.name?.ar || c.name?.fr)
    .filter(Boolean)
    .join(", ");

  if (locale === "ar") {
    return `اكتشف أفضل المنتجات المغربية الطبيعية في هيوامي. ${productList}. نوفر ${categoryList} عالية الجودة. توصيل مجاني للطلبات فوق 500 درهم.`;
  } else {
    return `Découvrez les meilleurs produits marocains naturels chez Huyamy. ${productList}. Nous proposons ${categoryList} de haute qualité. Livraison gratuite pour les commandes supérieures à 500 DH.`;
  }
}

/**
 * SEO cache tags that should trigger revalidation when content changes
 */
export const SEO_CACHE_TAGS = [
  "seo-meta",
  "structured-data",
  "og-images",
] as const;

export type SEOCacheTag = (typeof SEO_CACHE_TAGS)[number];
