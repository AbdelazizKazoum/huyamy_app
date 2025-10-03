// lib/services/productService.ts
import { adminDb } from "@/lib/firebaseAdmin";
import { Product, Category } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  const snap = await adminDb
    .collection("products")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductBySlug(slug: string) {
  // First, try to find by slug
  const slugQuery = adminDb
    .collection("products")
    .where("slug", "==", slug)
    .limit(1);
  const slugSnap = await slugQuery.get();

  if (!slugSnap.empty) {
    const doc = slugSnap.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // If not found by slug, search by Arabic name
  const arNameQuery = adminDb
    .collection("products")
    .where("name.ar", "==", slug)
    .limit(1);
  const arNameSnap = await arNameQuery.get();

  if (!arNameSnap.empty) {
    const doc = arNameSnap.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // If not found by Arabic name, search by French name
  const frNameQuery = adminDb
    .collection("products")
    .where("name.fr", "==", slug)
    .limit(1);
  const frNameSnap = await frNameQuery.get();

  if (!frNameSnap.empty) {
    const doc = frNameSnap.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // If not found in any field, return null
  return null;
}

export async function getProductById(
  productId: string
): Promise<Product | null> {
  const doc = await adminDb.collection("products").doc(productId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Product;
}

export async function getProductsByIds(
  productIds: string[]
): Promise<Product[]> {
  if (productIds.length === 0) return [];

  // Create document references
  const docRefs = productIds.map((id) =>
    adminDb.collection("products").doc(id)
  );

  // Get all documents in a single batch operation
  const docs = await adminDb.getAll(...docRefs);

  // Filter out documents that don't exist and map to Product objects
  return docs
    .filter((doc) => doc.exists)
    .map((doc) => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductsByCategoryId(
  categoryId: string
): Promise<Product[]> {
  const snap = await adminDb
    .collection("products")
    .where("categoryId", "==", categoryId)
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getCategories(): Promise<Category[]> {
  const snap = await adminDb.collection("categories").orderBy("name").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function getCategoryById(
  categoryId: string
): Promise<Category | null> {
  const doc = await adminDb.collection("categories").doc(categoryId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Category;
}

export async function getCategoriesByIds(
  categoryIds: string[]
): Promise<Category[]> {
  if (categoryIds.length === 0) return [];

  // Create document references
  const docRefs = categoryIds.map((id) =>
    adminDb.collection("categories").doc(id)
  );

  // Get all documents in a single batch operation
  const docs = await adminDb.getAll(...docRefs);

  // Filter out documents that don't exist and map to Category objects
  return docs
    .filter((doc) => doc.exists)
    .map((doc) => ({ id: doc.id, ...doc.data() } as Category));
}
