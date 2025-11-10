import { NextResponse } from "next/server";
import Stripe from "stripe";
// --- THIS IS YOUR FIREBASE ADMIN SDK ---
// You MUST set this up to update your database.
// Example: import { adminDb } from '@/lib/firebase-admin';

// Initialize Stripe with your SECRET key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  // 1. Verify the event is genuinely from Stripe
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error(
      "Webhook signature verification failed.",
      (err as Error).message
    );
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }

  // 2. Handle the 'payment_intent.succeeded' event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`PaymentIntent ${paymentIntent.id} succeeded!`);

    // --- THIS IS YOUR PRODUCTION LOGIC ---
    // The payment is 100% confirmed. Now, fulfill the order.
    //
    // 1. Find the order in your Firebase DB using the paymentIntent.id
    //    (You saved this in `onCardPaymentSuccess` in checkout.jsx)
    //
    // const orderQuery = adminDb.collection('orders')
    //   .where('paymentIntentId', '==', paymentIntent.id)
    //   .limit(1);
    //
    // const querySnapshot = await orderQuery.get();
    //
    // if (querySnapshot.empty) {
    //   console.error(`CRITICAL: No order found for PaymentIntent ${paymentIntent.id}`);
    //   // You might want to email yourself here to manually check
    //   return NextResponse.json({ error: "Order not found" }, { status: 404 });
    // }
    //
    // const orderDoc = querySnapshot.docs[0];
    //
    // // 2. Update the order status to "paid" or "fulfilled"
    // await orderDoc.ref.update({
    //   status: 'paid', // Or 'processing', 'fulfilled', etc.
    //   updatedAt: new Date().toISOString(),
    // });
    //
    // 3. (Optional) Send a confirmation email, trigger shipping, etc.
    // await sendOrderConfirmationEmail(orderDoc.data());

    console.log(
      `Order for PaymentIntent ${paymentIntent.id} has been fulfilled.`
    );
  }

  // 3. Acknowledge the event to Stripe
  return NextResponse.json({ received: true });
}
