import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
// Import your types. Adjust the path as needed.
import { Product, ProductVariant } from "@/types";

// --- THIS IS YOUR FIREBASE ADMIN SDK ---
// You must set this up to fetch from your database.
// Example: import { adminDb } from '@/lib/firebase-admin';

// Initialize Stripe with your SECRET key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});

// 1. Define the shape of data we *trust* from the client.
// We ONLY accept IDs and quantity. We IGNORE any price.
const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable(),
  quantity: z.number().min(1),
});

// Define the expected request body
const paymentIntentSchema = z.object({
  items: z.array(cartItemSchema),
});

// 2. --- THIS IS YOUR PLACEHOLDER ---
// This function MUST be replaced with a real database call
// to your Firebase collection to get the product/variant data.
const getProductDataFromDb = async (
  productId: string,
  variantId: string | null
): Promise<{ price: number; name: string }> => {
  console.warn(`--- USING MOCK DATA FOR ${productId} ---`);
  //
  // --- PRODUCTION LOGIC (Your To-Do) ---
  //
  // try {
  //   const productRef = adminDb.collection('products').doc(productId);
  //   const docSnap = await productRef.get();
  //
  //   if (!docSnap.exists) {
  //     throw new Error(`Product ${productId} not found.`);
  //   }
  //
  //   const product = docSnap.data() as Product;
  //
  //   if (variantId && product.variants) {
  //     const variant = product.variants.find(v => v.id === variantId);
  //     if (!variant) {
  //       throw new Error(`Variant ${variantId} not found.`);
  //     }
  //     // Return price and name from the *variant*
  //     return { price: variant.price, name: `${product.name.en} - ${Object.values(variant.options).join('/')}` };
  //   }
  //
  //   // Return price and name from the *base product*
  //   return { price: product.price, name: product.name.en };
  //
  // } catch (error) {
  //   console.error("Failed to fetch product from DB:", error);
  //   throw new Error("Could not retrieve product data.");
  // }
  //

  // --- MOCK LOGIC (For Now) ---
  // Return a mock price for testing.
  // This is insecure and MUST be replaced.
  if (variantId) {
    return { price: 129.99, name: "Mock Variant Product" };
  }
  return { price: 99.99, name: "Mock Base Product" };
};

// 3. This function uses your placeholder to securely calculate the total
const calculateOrderAmount = async (
  items: z.infer<typeof cartItemSchema>[]
) => {
  let total = 0;

  // We fetch each item's price from our (mock) DB
  for (const item of items) {
    const { price } = await getProductDataFromDb(
      item.productId,
      item.variantId
    );
    total += price * item.quantity;
  }

  // Stripe requires the amount in the smallest currency unit (e.g., cents)
  // For MAD (Moroccan Dirham), which has 2 decimal places, we multiply by 100.
  return Math.round(total * 100);
};

// 4. The main API handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the incoming data
    const validation = paymentIntentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { items } = validation.data;
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // --- This is the secure part ---
    // Calculate the total on the server, ignoring client prices.
    const amount = await calculateOrderAmount(items);

    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "mad", // Moroccan Dirham
      automatic_payment_methods: {
        enabled: true, // Let Stripe manage card, Apple Pay, etc.
      },
    });

    // Send the *client secret* back to the frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
