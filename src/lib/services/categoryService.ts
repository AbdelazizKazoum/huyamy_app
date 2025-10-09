import { adminDb } from "@/lib/firebaseAdmin";
import { Category } from "@/types";
import { FieldValue } from "firebase-admin/firestore";

// --- Read Operations ---

export async function getCategories(): Promise<Category[]> {
  const snap = await adminDb
    .collection("categories")
    .orderBy("name.ar") // Or any default sorting you prefer
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function getCategoryById(
  categoryId: string
): Promise<Category | null> {
  const doc = await adminDb.collection("categories").doc(categoryId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Category;
}

// --- CRUD Operations ---

export async function createCategory(
  categoryData: Omit<Category, "id">
): Promise<Category> {
  const categoryRef = adminDb.collection("categories").doc();
  const newCategory = {
    ...categoryData,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  await categoryRef.set(newCategory);
  // Firestore's server timestamp is not available on the client-side object immediately.
  // We return the object with the client-side date, which is close enough for UI updates.
  return { id: categoryRef.id, ...newCategory } as Category;
}

export async function updateCategory(
  categoryId: string,
  categoryData: Partial<Category>
): Promise<void> {
  const categoryRef = adminDb.collection("categories").doc(categoryId);
  await categoryRef.update({
    ...categoryData,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const categoryRef = adminDb.collection("categories").doc(categoryId);
  await categoryRef.delete();
}
