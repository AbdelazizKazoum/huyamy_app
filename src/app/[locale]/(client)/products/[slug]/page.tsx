import React from "react";
import { Star } from "lucide-react";
import { Language, Product } from "@/types";
import { currencies } from "@/data";
import ProductImageGallery from "@/components/ProductImageGallery";
import CheckoutForm from "@/components/forms/CheckoutForm";
import CountdownTimer from "@/components/CountdownTimer";
import { getProductBySlug } from "@/lib/services/productService";
import { unstable_cache } from "next/cache";
import { CACHE_CONFIG, getProductDetailTag } from "@/lib/cache/tags";
import { notFound } from "next/navigation";

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

// Cache the product fetching function with slug-specific caching
const getCachedProductBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      console.log(
        `[CACHE] Fetching product detail for slug: ${slug} at ${new Date().toISOString()}`
      );
      const rawProduct = await getProductBySlug(slug);
      return rawProduct ? serializeProduct(rawProduct) : null;
    },
    [`${CACHE_CONFIG.PRODUCT_DETAIL.key[0]}-${slug}`],
    {
      revalidate: CACHE_CONFIG.PRODUCT_DETAIL.revalidate,
      tags: [
        ...CACHE_CONFIG.PRODUCT_DETAIL.tags,
        getProductDetailTag(slug), // Slug-specific tag for targeted revalidation
      ],
    }
  );

// Generate static params for popular products (optional - for better performance)
export async function generateStaticParams() {
  // You can return an array of popular product slugs to pre-generate
  // For now, returning empty array to generate on-demand
  return [];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;

  // Get cached product data for metadata
  const getCachedProduct = getCachedProductBySlug(slug);
  const product = await getCachedProduct();

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name[locale]} | هويامي ستور`,
    description: product.description[locale],
    openGraph: {
      title: product.name[locale],
      description: product.description[locale],
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name[locale],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name[locale],
      description: product.description[locale],
      images: [product.image],
    },
  };
}

// Main Page Component
export default async function ProductDetailsPage({ params }: Props) {
  const { locale, slug } = await params;
  const currency = currencies[locale];

  // Get cached product data
  const getCachedProduct = getCachedProductBySlug(slug);
  const product = await getCachedProduct();

  // Handle product not found
  if (!product) {
    notFound();
  }

  // Set offer to end 3 days from now for demonstration
  const offerEndDate = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;

  return (
    <>
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="bg-white"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <main className="py-12">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Right Side: Product Gallery */}
              <div>
                <ProductImageGallery product={product} lang={locale} />
              </div>
              {/* Left Side: Product Details & Form */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name[locale]}
                </h1>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-green-800">
                    {product.price.toFixed(2)} {currency}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xl text-gray-400 line-through ml-4">
                      {product.originalPrice.toFixed(2)} {currency}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                    />
                  ))}
                </div>

                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <CountdownTimer
                      expiryTimestamp={offerEndDate}
                      lang={locale}
                    />
                  )}

                <div className="text-gray-700 space-y-2">
                  <p>{product.description[locale]}</p>
                </div>

                <CheckoutForm lang={locale} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Enable ISR for this page
export const revalidate = CACHE_CONFIG.PRODUCT_DETAIL.revalidate; // 7 days
