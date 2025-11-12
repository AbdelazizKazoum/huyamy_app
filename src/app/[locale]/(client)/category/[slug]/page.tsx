import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { Product, Category, Locale } from "@/types";
import { CACHE_CONFIG, CACHE_TAGS } from "@/lib/cache/tags";
import ProductsClient from "@/app/[locale]/(client)/products/components/ProductsClient";
import ProductsLoadingSkeleton from "@/app/[locale]/(client)/products/components/ProductsLoadingSkeleton";
import { getCategories } from "@/lib/services/categoryService";
// You will need to create these new service functions
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
} from "@/lib/services/productService";
import CategoryHeader from "./components/CategoryHeader";
import CategoryError from "./components/CategoryError";

// Helper function to serialize Firestore data
function serializeFirestoreData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (
        value &&
        typeof value === "object" &&
        "_seconds" in value &&
        "_nanoseconds" in value
      ) {
        return new Date(
          (value._seconds as number) * 1000 +
            (value._nanoseconds as number) / 1000000
        ).toISOString();
      }
      return value;
    })
  );
}

// Cached function to fetch products for a specific category
const getCachedProductsByCategory = (slug: string) =>
  unstable_cache(
    async (): Promise<Product[]> => {
      console.log(`Getting cached products for category: ${slug}...`);
      try {
        const products = await getProductsByCategorySlug(slug);
        console.log("🚀 ~ getCachedProductsByCategory ~ products:", products);

        return serializeFirestoreData(products);
      } catch (error) {
        console.error("Error in getCachedProductsByCategory:", error);
        return [];
      }
    },
    [`products-by-category-${slug}`],
    {
      revalidate: CACHE_CONFIG.CATEGORIES.revalidate,
      tags: [CACHE_TAGS.CATEGORIES, `category:${slug}`],
    }
  )();

// Cached function to fetch all categories
const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    console.log("Getting cached categories...");
    try {
      const categories = await getCategories();
      return serializeFirestoreData(categories);
    } catch (error) {
      console.error("Error in getCachedCategories:", error);
      return [];
    }
  },
  CACHE_CONFIG.CATEGORIES.key,
  {
    revalidate: CACHE_CONFIG.CATEGORIES.revalidate,
    tags: CACHE_CONFIG.CATEGORIES.tags,
  }
);

// Server component for data fetching and rendering
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;

  try {
    // Fetch data in parallel
    const [products, allCategories] = await Promise.all([
      getCachedProductsByCategory(slug),
      getCachedCategories(),
    ]);

    const currentCategory = allCategories.find((c) => c.slug === slug);

    if (!currentCategory) {
      notFound();
    }

    const maxPrice =
      products.length > 0
        ? Math.ceil(
            products.reduce((max, p) => (p.price > max ? p.price : max), 0)
          )
        : 1000;

    const initialData = {
      products,
      categories: [currentCategory], // Pass only the current category to the client
      maxPrice: maxPrice > 0 ? maxPrice : 1000,
    };

    return (
      <div className="bg-neutral-50/70">
        <CategoryHeader category={currentCategory} locale={locale} />

        <Suspense fallback={<ProductsLoadingSkeleton />}>
          <ProductsClient initialData={initialData} locale={locale} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error(`CategoryPage error for slug ${slug}:`, error);

    return <CategoryError locale={locale} />;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;

  try {
    // You will need to create this service function
    const category = await getCategoryBySlug(slug);

    if (!category) {
      return {
        title: "Category Not Found",
      };
    }

    const title = `${category.name[locale]} | Products`;
    const description =
      category.description?.[locale] ||
      `Browse all products in the ${category.name[locale]} category.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        locale: locale,
        images: category.image ? [category.image] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: category.image ? [category.image] : [],
      },
      alternates: {
        canonical: `/category/${slug}`,
        languages: {
          ar: `/ar/category/${slug}`,
          fr: `/fr/category/${slug}`,
        },
      },
    };
  } catch (error) {
    console.error("Metadata generation error for category:", error);
    return {
      title: "Products",
      description: "Browse our product catalog",
    };
  }
}
