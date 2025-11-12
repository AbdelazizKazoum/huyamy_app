import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";
import { createOrderInFirestore } from "@/lib/services/orderService";
import { getProductsByIds } from "@/lib/services/productService";
import { OrderData } from "@/types/order";

// Define the expected item structure from metadata
interface CartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

// Initialize Stripe with your SECRET key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  // 1. Verify the event is genuinely from Stripe
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    const errorMessage = `Webhook Error: ${(err as Error).message}`;
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // 2. Handle the 'payment_intent.succeeded' event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(
      `Webhook received: PaymentIntent ${paymentIntent.id} succeeded.`
    );

    try {
      // Check if an order for this payment intent already exists to prevent duplicates
      const existingOrderQuery = await adminDb
        .collection("orders")
        .where("paymentIntentId", "==", paymentIntent.id)
        .limit(1)
        .get();

      if (!existingOrderQuery.empty) {
        console.log(
          `Order for PaymentIntent ${paymentIntent.id} already exists. Skipping creation.`
        );
        return NextResponse.json({
          received: true,
          message: "Order already exists.",
        });
      }

      // --- Reconstruct OrderData from PaymentIntent Metadata ---
      const {
        shippingInfo,
        items: itemsString,
        locale,
      } = paymentIntent.metadata;

      if (!shippingInfo || !itemsString || !locale) {
        throw new Error(
          `Missing critical metadata (shippingInfo, items, or locale) for PaymentIntent ${paymentIntent.id}`
        );
      }

      // The items are now just IDs and quantities, we need to reconstruct them.
      const cartItems: CartItem[] = JSON.parse(itemsString);
      const productIds = cartItems.map((item) => item.productId);
      const productsFromDb = await getProductsByIds(productIds);
      const productMap = new Map(productsFromDb.map((p) => [p.id, p]));

      const reconstructedProducts = cartItems
        .map((item) => {
          const product = productMap.get(item.productId);
          if (!product) return null; // Should not happen if validation is correct

          const variantDescription = item.variantId
            ? ` - ${Object.values(
                product.variants?.find((v) => v.id === item.variantId)
                  ?.options ?? {}
              ).join(" / ")}`
            : "";
          const itemPrice = item.variantId
            ? product.variants?.find((v) => v.id === item.variantId)?.price ??
              product.price
            : product.price;
          const itemImage =
            product.variants?.find((v) => v.id === item.variantId)
              ?.images?.[0] ?? product.image;

          return {
            id: product.id,
            name: {
              ar: `${product.name.ar}${variantDescription}`,
              fr: `${product.name.fr}${variantDescription}`,
            },
            price: itemPrice,
            quantity: item.quantity,
            image: itemImage,
            variant:
              product.variants?.find((v) => v.id === item.variantId)?.options ??
              null,
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

      if (reconstructedProducts.length !== cartItems.length) {
        throw new Error(
          `Could not reconstruct all products for PaymentIntent ${paymentIntent.id}. Some products may no longer exist.`
        );
      }

      const orderData: OrderData = {
        shippingInfo: JSON.parse(shippingInfo),
        products: reconstructedProducts,
        totalAmount: paymentIntent.amount / 100, // Convert from cents
        locale: (locale as unknown as OrderData["locale"]) || "fr",
        orderDate: new Date(paymentIntent.created * 1000).toISOString(),
        paymentMethod: "card",
        paymentIntentId: paymentIntent.id,
        status: "pending", // Set initial status
      };

      // Create the order in Firestore using the new service
      await createOrderInFirestore(orderData);

      console.log(
        `Successfully created order for PaymentIntent ${paymentIntent.id}.`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error(
        `CRITICAL: Failed to process webhook for PaymentIntent ${paymentIntent.id}. Error: ${errorMessage}`
      );
      // If this fails, you should have a monitoring system (e.g., email alert)
      // to notify you to manually create the order.
      return NextResponse.json(
        { error: "Webhook handler failed.", details: errorMessage },
        { status: 500 }
      );
    }
  } else {
    console.log(`Webhook received unhandled event type: ${event.type}`);
  }

  // 3. Acknowledge the event to Stripe
  return NextResponse.json({ received: true });
}
