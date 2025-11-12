import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductsByIds } from "@/lib/services/productService";

// Define the expected item structure
interface CartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json();

    // Validate the request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    // Extract product IDs from items
    const productIds = items.map((item) => item.productId);

    // Fetch products from database
    const products = await getProductsByIds(productIds);

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calculate the total amount in cents
    let totalAmount = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (
        !item.quantity ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid quantity for item" },
          { status: 400 }
        );
      }

      // Get the price - use variant price if variantId is provided, otherwise use base price
      let itemPrice = product.price;

      if (item.variantId) {
        const variant = product.variants?.find((v) => v.id === item.variantId);
        if (variant) {
          itemPrice = variant.price;
        }
      }

      // Convert to cents (assuming prices are in MAD)
      totalAmount += Math.round(itemPrice * 100) * item.quantity;
    }

    // Create a PaymentIntent with the calculated amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "mad", // Moroccan Dirham
      payment_method_types: ["card"], // Only allow card payments
      metadata: {
        // Store the minimal items list for the webhook to use
        items: JSON.stringify(items),
        locale: request.headers.get("x-next-intl-locale") || "ar",
      },
    });

    // Return the client secret
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
