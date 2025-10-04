"use server";

import { checkoutSchema, FormState } from "@/lib/schemas";
import { createGuestOrder } from "@/lib/services/orderService";
import { revalidatePath } from "next/cache";

// This is the Server Action that our form will call.
export async function createOrderAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Convert FormData to a plain object
  const data = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  // 2. Validate the data using our Zod schema
  const parsed = checkoutSchema.safeParse(data);

  // 3. If validation fails, return the errors to the form
  if (!parsed.success) {
    return {
      message: "Form submission failed. Please check the errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // 4. If validation succeeds, call the Firebase service
  try {
    await createGuestOrder(parsed.data);

    // Optional: Revalidate a path if you have a page that lists orders
    // revalidatePath('/admin/orders');

    // 5. Return a success message
    return {
      message: "Your order has been placed successfully!",
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
