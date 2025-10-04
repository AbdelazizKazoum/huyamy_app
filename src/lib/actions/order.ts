"use server";

import { checkoutSchema, FormState } from "@/lib/schemas";
import { createGuestOrder } from "@/lib/services/orderService";
import { revalidatePath } from "next/cache";

// Localized messages for order processing
const messages = {
  ar: {
    formError: "معلومات ناقصة. يرجى التحقق من بيانات التوصيل.",
    success: "🎉 تم تأكيد طلبكم! سنتواصل معكم قريباً لترتيب التوصيل.",
    error: "خطأ في تأكيد الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا.",
  },
  fr: {
    formError:
      "Informations incomplètes. Veuillez vérifier vos données de livraison.",
    success:
      "🎉 Commande confirmée ! Nous vous contacterons sous peu pour organiser la livraison.",
    error:
      "Erreur lors de la confirmation. Veuillez réessayer ou nous contacter.",
  },
};

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
    locale: (formData.get("locale") as "ar" | "fr") || "fr", // Get locale from form
  };

  // 2. Validate the data using our Zod schema
  const parsed = checkoutSchema.safeParse({
    fullName: data.fullName,
    phone: data.phone,
    address: data.address,
  });

  // 3. If validation fails, return the errors to the form
  if (!parsed.success) {
    return {
      message: messages[data.locale].formError,
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
      message: messages[data.locale].success,
    };
  } catch (error) {
    console.error("Failed to create order:", error);
    return {
      message: messages[data.locale].error,
    };
  }
}
