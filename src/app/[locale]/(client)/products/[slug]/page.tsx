import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { Star } from "lucide-react";
import { Language, Product } from "@/types";
import { unstable_cache } from "next/cache";
import { features } from "@/data/features";
import { getProductBySlug } from "@/lib/services/productService";
import { CACHE_CONFIG } from "@/lib/cache/tags";
import ProductImageGallery from "@/components/ProductImageGallery";
import CountdownTimer from "@/components/CountdownTimer";
import CheckoutForm from "@/components/forms/CheckoutForm";
import AddToCartForm from "@/components/AddToCartForm";
import { siteConfig } from "@/config/site";

type Props = {
  params: Promise<{ locale: Language; slug: string }>;
};

// Serialize product data to remove Firestore objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <>
      {/* Structured Data */}
      <ProductStructuredData
        product={product}
        locale={locale}
        currency={currency}
      />
      <BreadcrumbStructuredData product={product} locale={locale} />

      <div dir={locale === "ar" ? "rtl" : "ltr"} className="bg-white">
        <main className="py-12">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Dynamic Breadcrumb Navigation */}
            {/* <Breadcrumb lang={locale} product={product} />
             */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Gallery */}
              <div>
                <ProductImageGallery product={product} lang={locale} />
              </div>

              {/* Product Details & Form */}
              <div className="space-y-6">
                {/* Product Badge */}
                {product.isNew && (
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {locale === "ar" ? "جديد" : "Nouveau"}
                  </span>
                )}

                {/* Product Title */}
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name[locale]}
                </h1>

                {/* Price */}
                <div className="flex items-center space-x-4">
                  <p className="text-3xl font-bold text-primary-800">
                    {product.price.toFixed(2)} {currency}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xl text-gray-400 line-through">
                      {product.originalPrice.toFixed(2)} {currency}
                    </p>
                  )}
                  {product.originalPrice && (
                    <span className="bg-secondary-100 text-amber-500 text-sm font-medium px-2.5 py-0.5 rounded">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-amber-400 fill-current"
                      />
                    ))}
                  </div>
                  {/* <span className="text-gray-600 text-sm">
                    (4.8/5 - 127 {locale === "ar" ? "تقييم" : "avis"})
                  </span> */}
                </div>

                {/* Countdown Timer */}
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <CountdownTimer lang={locale} />
                  )}

                {/* Product Description */}
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {locale === "ar" ? "وصف المنتج" : "Description du produit"}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description[locale]}
                  </p>
                </div>

                {/* Checkout Form */}
                <CheckoutForm lang={locale} product={product} />

                {/* Add to Cart Form */}
                <AddToCartForm product={product} lang={locale} />

                {/* Features/Benefits Section */}
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    {locale === "ar" ? "مميزات المتجر" : "Avantages du magasin"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 mb-3 text-primary-800">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {feature.title[locale]}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {feature.description[locale]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
// Enable ISR for this page// Enable ISR for this page
// export const revalidate = CACHE_CONFIG.PRODUCT_DETAIL.revalidate; // 7 days
