// lib/services/productService.ts
import { adminDb } from "@/lib/firebaseAdmin";

export async function getAllProducts() {
  const snap = await adminDb
    .collection("products")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductBySlug(slug: string) {
  const q = adminDb.collection("products").where("slug", "==", slug).limit(1);
  const snap = await q.get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function getCategories() {
  const snap = await adminDb.collection("categories").orderBy("name").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
