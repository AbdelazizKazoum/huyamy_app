import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Product, Category, Locale } from "@/types";
import { CACHE_CONFIG } from "@/lib/cache/tags";
import ProductsClient from "./components/ProductsClient";
import ProductsLoadingSkeleton from "./components/ProductsLoadingSkeleton";
import { getAllProducts } from "@/lib/services/productService";
import { getCategories } from "@/lib/services/categoryService";

// Cached function to fetch products directly from database
const getCachedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    console.log("Getting cached products...");
    try {
      const products = await getAllProducts();
      return products;
    } catch (error) {
      console.error("Error in getCachedProducts:", error);
      // Return empty array to prevent complete failure
      return [];
    }
  },
  CACHE_CONFIG.PRODUCTS.key,
  {
    revalidate: CACHE_CONFIG.PRODUCTS.revalidate,
    tags: CACHE_CONFIG.PRODUCTS.tags,
  }
);

// Cached function to fetch categories directly from database
const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    console.log("Getting cached categories...");
    try {
      const categories = await getCategories();
      return categories;
    } catch (error) {
      // Return empty array to prevent complete failure
      return [];
    }
  },
  CACHE_CONFIG.CATEGORIES.key,
  {
    revalidate: CACHE_CONFIG.CATEGORIES.revalidate,
    tags: CACHE_CONFIG.CATEGORIES.tags,
  }
);

// Server component for data fetching and SEO
export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  try {
    const t = await getTranslations("products");

    // Fetch data in parallel on the server
    const [products, categories] = await Promise.all([
      getCachedProducts(),
      getCachedCategories(),
    ]);

    console.log("Data fetched:", {
      productsCount: products.length,
      categoriesCount: categories.length,
    });

    // Handle empty data gracefully
    if (products.length === 0 && categories.length === 0) {
      console.warn("No products or categories found");
    }

    const maxPrice =
      products.length > 0
        ? Math.ceil(
            products.reduce((max, p) => (p.price > max ? p.price : max), 0)
          )
        : 1000;

    const initialData = {
      products,
      categories,
      maxPrice: maxPrice > 0 ? maxPrice : 1000,
    };

    return (
      <div className="bg-neutral-50/70">
        <Suspense fallback={<ProductsLoadingSkeleton />}>
          <ProductsClient initialData={initialData} locale={locale} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("ProductsPage error:", error);

    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-600 bg-red-50 p-8 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold mb-2">Unable to Load Products</h2>
          <p className="mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <a
            href={`/${locale}/products`}
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  try {
    const t = await getTranslations("products");

    return {
      title: t("pageTitle"),
      description: t("pageDescription"),
      openGraph: {
        title: t("pageTitle"),
        description: t("pageDescription"),
        type: "website",
        locale: locale,
      },
      twitter: {
        card: "summary_large_image",
        title: t("pageTitle"),
        description: t("pageDescription"),
      },
      alternates: {
        canonical: `/products`,
        languages: {
          ar: "/ar/products",
          en: "/en/products",
          fr: "/fr/products",
        },
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: "Products",
      description: "Browse our product catalog",
    };
  }
}
