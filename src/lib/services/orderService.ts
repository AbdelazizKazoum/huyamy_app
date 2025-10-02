/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/orderService.ts
import { adminAuth, adminDb, default as admin } from "@/lib/firebaseAdmin";

export async function createOrderServer(token: string, orderData: any) {
  "use server"; // ensures this runs on the server when invoked as a Server Action
  const decoded = await adminAuth.verifyIdToken(token); // throws if invalid
  const uid = decoded.uid;

  const orderRef = adminDb.collection("orders").doc();
  await orderRef.set({
    userId: uid,
    ...orderData,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: orderRef.id };
}
