import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Product, Category, Locale } from "@/types";
import { CACHE_CONFIG } from "@/lib/cache/tags";
import ProductsClient from "./components/ProductsClient";
import ProductsLoadingSkeleton from "./components/ProductsLoadingSkeleton";

// Get the base URL for server-side fetching
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://your-domain.com";
};

// Cached function to fetch products
const getCachedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/products`, {
      next: {
        revalidate: CACHE_CONFIG.PRODUCTS.revalidate,
        tags: CACHE_CONFIG.PRODUCTS.tags,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },
  CACHE_CONFIG.PRODUCTS.key,
  {
    revalidate: CACHE_CONFIG.PRODUCTS.revalidate,
    tags: CACHE_CONFIG.PRODUCTS.tags,
  }
);

// Cached function to fetch categories
const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/categories`, {
      next: {
        revalidate: CACHE_CONFIG.CATEGORIES.revalidate,
        tags: CACHE_CONFIG.CATEGORIES.tags,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },
  CACHE_CONFIG.CATEGORIES.key,
  {
    revalidate: CACHE_CONFIG.CATEGORIES.revalidate,
    tags: CACHE_CONFIG.CATEGORIES.tags,
  }
);

// Server component for data fetching and SEO
export default async function ProductsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations("products");

  try {
    // Fetch data in parallel on the server
    const [products, categories] = await Promise.all([
      getCachedProducts(),
      getCachedCategories(),
    ]);

    const maxPrice = Math.ceil(
      products.reduce((max, p) => (p.price > max ? p.price : max), 0)
    );

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
    console.error("Failed to fetch products data:", error);

    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-600 bg-red-50 p-8 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold mb-2">{t("errorTitle")}</h2>
          <p className="mb-4">{t("fetchError")}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t("retry", { defaultValue: "Try Again" })}
          </button>
        </div>
      </div>
    );
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
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
}
