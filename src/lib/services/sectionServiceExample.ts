// Example usage of section service
import {
  getSectionWithProducts,
  getAllSectionsWithProducts,
} from "@/lib/services/sectionService";

// Example 1: Get the hero section with its products
export async function getHeroSectionData() {
  const heroSection = await getSectionWithProducts("home-hero");

  if (heroSection) {
    console.log("Hero section:", heroSection);
    console.log("Hero products:", heroSection.products);

    // You can now use:
    // - heroSection.data.title (localized title)
    // - heroSection.data.subtitle (localized subtitle)
    // - heroSection.products (array of Product objects)

    return heroSection;
  }

  return null;
}

// Example 2: Get all sections with their products
export async function getAllPageSections() {
  const sections = await getAllSectionsWithProducts();

  sections.forEach((section) => {
    console.log(`Section ${section.id}:`, section.data);
    console.log(`Products:`, section.products?.length || 0);
  });

  return sections;
}

// Example 3: Using in your page component
/*
In your page.tsx:

export default async function EcommerceLandingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  // Get hero section with products
  const heroSection = await getSectionWithProducts("home-hero");
  
  // Get all products for other sections
  const products = await getAllProducts();

  return (
    <>
      <div className="bg-white">
        <main>
          <HeroSection 
            title={heroSection?.data.title}
            subtitle={heroSection?.data.subtitle}
            featuredProducts={heroSection?.products || []}
          />
          <CategoriesSection categories={categories} />
          <ProductSection
            title={t("popularProducts.title")}
            subtitle={t("popularProducts.subtitle")}
            products={products.slice(0, 4)}
            bgColor="bg-stone-50"
          />
        </main>
      </div>
    </>
  );
}
*/
