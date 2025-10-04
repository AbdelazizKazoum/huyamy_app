/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb, default as admin, adminAuth } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { checkoutSchema } from "@/lib/schemas";

// Type alias for validated order data, derived from our Zod schema
type OrderData = z.infer<typeof checkoutSchema>;

/**
 * Creates an order for an unauthenticated "guest" user.
 * This is ideal for public-facing checkout forms.
 * @param {OrderData} orderData - The validated order data.
 */
export async function createGuestOrder(orderData: OrderData) {
  const orderRef = adminDb.collection("orders").doc();
  await orderRef.set({
    ...orderData, // Contains fullName, phone, address
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Guest order created with ID: ${orderRef.id}`);
  return { id: orderRef.id };
}

/**
 * Creates an order for a signed-in user.
 * Use this when you can provide a user's auth token.
 * @param {string} token - The Firebase ID token of the authenticated user.
 * @param {any} orderData - The data for the order.
 */
export async function createAuthenticatedOrder(token: string, orderData: any) {
  const decoded = await adminAuth.verifyIdToken(token); // throws if invalid
  const uid = decoded.uid;

  const orderRef = adminDb.collection("orders").doc();
  await orderRef.set({
    userId: uid,
    ...orderData,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(
    `Authenticated order created for user ${uid} with ID: ${orderRef.id}`
  );
  return { id: orderRef.id };
}
