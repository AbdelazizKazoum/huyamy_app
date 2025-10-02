// lib/services/sectionService.ts
import { adminDb } from "@/lib/firebaseAdmin";
import { Section, SectionWithProducts, Product } from "@/types";
import { getProductsByIds } from "./productService";

export async function getAllSections(): Promise<Section[]> {
  const snap = await adminDb
    .collection("sections")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      } as Section)
  );
}

export async function getSectionById(
  sectionId: string
): Promise<Section | null> {
  try {
    const doc = await adminDb.collection("sections").doc(sectionId).get();
    if (!doc.exists) {
      console.log(`Section with ID ${sectionId} not found`);
      return null;
    }

    const data = doc.data();
    console.log(`Found section ${sectionId}:`, data);

    return {
      id: doc.id,
      ...data,
    } as Section;
  } catch (error) {
    console.error(`Error fetching section ${sectionId}:`, error);
    return null;
  }
}

export async function getSectionWithProducts(
  sectionId: string
): Promise<SectionWithProducts | null> {
  const section = await getSectionById(sectionId);
  if (!section) return null;

  console.log(`Section data structure:`, section.data);

  // Get products if ctaProductIds exist
  let products: Product[] = [];
  if (section.data?.ctaProductIds && section.data.ctaProductIds.length > 0) {
    console.log(`Fetching products for IDs:`, section.data.ctaProductIds);
    products = await getProductsByIds(section.data.ctaProductIds);
    console.log(`Found ${products.length} products for section ${sectionId}`);
  } else {
    console.log(`No ctaProductIds found in section ${sectionId}`);
  }

  return {
    ...section,
    products,
  };
}

export async function getAllSectionsWithProducts(): Promise<
  SectionWithProducts[]
> {
  const sections = await getAllSections();

  // Process all sections and get their products
  const sectionsWithProducts = await Promise.all(
    sections.map(async (section) => {
      let products: Product[] = [];
      if (section.data.ctaProductIds && section.data.ctaProductIds.length > 0) {
        products = await getProductsByIds(section.data.ctaProductIds);
      }

      return {
        ...section,
        products,
      };
    })
  );

  return sectionsWithProducts;
}

export async function getActiveSections(): Promise<Section[]> {
  // Since your Firebase document doesn't have isActive field yet,
  // let's get all sections for now. You can add isActive field later if needed.
  const snap = await adminDb
    .collection("sections")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      } as Section)
  );
}

export async function getActiveSectionsWithProducts(): Promise<
  SectionWithProducts[]
> {
  const sections = await getActiveSections();

  // Process all sections and get their products
  const sectionsWithProducts = await Promise.all(
    sections.map(async (section) => {
      let products: Product[] = [];
      if (section.data.ctaProductIds && section.data.ctaProductIds.length > 0) {
        products = await getProductsByIds(section.data.ctaProductIds);
      }

      return {
        ...section,
        products,
      };
    })
  );

  return sectionsWithProducts;
}

export async function getSectionsByType(
  sectionType: string
): Promise<Section[]> {
  const snap = await adminDb
    .collection("sections")
    .where("type", "==", sectionType)
    .get();

  return snap.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      } as Section)
  );
}

export async function getLandingPageSectionsWithProducts(): Promise<SectionWithProducts[]> {
  const sections = await getSectionsByType("landing-page");
  
  // Process all landing-page sections and get their products
  const sectionsWithProducts = await Promise.all(
    sections.map(async (section) => {
      let products: Product[] = [];
      if (section.data?.ctaProductIds && section.data.ctaProductIds.length > 0) {
        console.log(`Fetching products for landing-page section ${section.id}:`, section.data.ctaProductIds);
        products = await getProductsByIds(section.data.ctaProductIds);
        console.log(`Found ${products.length} products for landing-page section ${section.id}`);
      } else {
        console.log(`No ctaProductIds found in landing-page section ${section.id}`);
      }
      
      return {
        ...section,
        products,
      };
    })
  );

  return sectionsWithProducts;
}

// Test function to verify the service is working correctly
export async function testSectionService(): Promise<void> {
  console.log("🧪 Testing Section Service...");

  try {
    // Test 1: Get all sections
    console.log("📋 Getting all sections...");
    const allSections = await getAllSections();
    console.log(`Found ${allSections.length} sections:`, allSections);

    // Test 2: Get specific section
    console.log("🎯 Getting home-hero section...");
    const heroSection = await getSectionById("home-hero");
    console.log("Hero section:", heroSection);

    // Test 3: Get section with products
    console.log("🛍️ Getting home-hero section with products...");
    const heroWithProducts = await getSectionWithProducts("home-hero");
    console.log("Hero section with products:", heroWithProducts);

    console.log("✅ Section service test completed successfully!");
  } catch (error) {
    console.error("❌ Section service test failed:", error);
  }
}
