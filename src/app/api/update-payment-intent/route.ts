import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});

// Define the expected shipping schema for validation
const shippingSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const {
      paymentIntentId,
      shippingInfo,
    }: { paymentIntentId: string; shippingInfo: unknown } =
      await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 }
      );
    }

    // Validate the shipping info
    const parsedShippingInfo = shippingSchema.safeParse(shippingInfo);
    if (!parsedShippingInfo.success) {
      return NextResponse.json(
        {
          error: "Invalid shipping information",
          details: parsedShippingInfo.error.flatten(),
        },
        { status: 400 }
      );
    }

    // First, retrieve the existing PaymentIntent to get its metadata
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return NextResponse.json(
        { error: "Payment Intent not found" },
        { status: 404 }
      );
    }

    // Merge new shipping info with existing metadata
    const newMetadata = {
      ...paymentIntent.metadata,
      shippingInfo: JSON.stringify(parsedShippingInfo.data),
    };

    // Update the PaymentIntent with the merged metadata
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: newMetadata,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error updating payment intent:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to update payment intent", details: errorMessage },
      { status: 500 }
    );
  }
}
