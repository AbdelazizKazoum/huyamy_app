import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Product, Category, Locale } from "@/types";
import { CACHE_CONFIG } from "@/lib/cache/tags";
import ProductsClient from "./components/ProductsClient";
import ProductsLoadingSkeleton from "./components/ProductsLoadingSkeleton";

// Get the base URL for server-side fetching with detailed logging
const getBaseUrl = () => {
  const vercelUrl = process.env.VERCEL_URL;
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL;
  const nodeEnv = process.env.NODE_ENV;
  
  console.log('Environment check:', {
    VERCEL_URL: vercelUrl,
    NEXT_PUBLIC_APP_URL: publicUrl,
    NODE_ENV: nodeEnv,
  });

  if (vercelUrl) {
    const url = `https://${vercelUrl}`;
    console.log('Using Vercel URL:', url);
    return url;
  }
  if (publicUrl) {
    console.log('Using public URL:', publicUrl);
    return publicUrl;
  }
  
  const fallbackUrl = nodeEnv === "development"
    ? "http://localhost:3000"
    : "https://your-domain.com";
  
  console.log('Using fallback URL:', fallbackUrl);
  return fallbackUrl;
};

// Cached function to fetch products with detailed error logging
const getCachedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const baseUrl = getBaseUrl();
    const endpoint = `${baseUrl}/api/products`;
    
    console.log('Fetching products from:', endpoint);
    
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-Server',
        },
        // Remove next.revalidate and tags from here for unstable_cache
        cache: 'no-store',
      });

      console.log('Products response status:', response.status);
      console.log('Products response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Products API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('Products data received, count:', Array.isArray(data) ? data.length : 'not an array');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Products fetch error:', error);
      throw error; // Re-throw to let unstable_cache handle it
    }
  },
  CACHE_CONFIG.PRODUCTS.key,
  {
    revalidate: CACHE_CONFIG.PRODUCTS.revalidate,
    tags: CACHE_CONFIG.PRODUCTS.tags,
  }
);

// Cached function to fetch categories with detailed error logging
const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const baseUrl = getBaseUrl();
    const endpoint = `${baseUrl}/api/categories`;
    
    console.log('Fetching categories from:', endpoint);
    
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-Server',
        },
        cache: 'no-store',
      });

      console.log('Categories response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Categories API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('Categories data received, count:', Array.isArray(data) ? data.length : 'not an array');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Categories fetch error:', error);
      throw error;
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
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  console.log('ProductsPage rendering for locale:', locale);
  
  try {
    const t = await getTranslations("products");

    // Fetch data in parallel on the server
    const [products, categories] = await Promise.all([
      getCachedProducts(),
      getCachedCategories(),
    ]);

    const maxPrice = products.length > 0 
      ? Math.ceil(products.reduce((max, p) => (p.price > max ? p.price : max), 0))
      : 1000;

    const initialData = {
      products,
      categories,
      maxPrice: maxPrice > 0 ? maxPrice : 1000,
    };

    console.log('Initial data prepared:', {
      productsCount: products.length,
      categoriesCount: categories.length,
      maxPrice,
    });

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
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
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
  params: { locale },
}: {
  params: { locale: Locale };
}) {
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
    console.error('Metadata generation error:', error);
    return {
      title: "Products",
      description: "Browse our product catalog",
    };
  }
}
