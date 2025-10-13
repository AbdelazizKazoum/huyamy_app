"use server";

import { checkoutSchema, FormState } from "@/lib/schemas";
import { createGuestOrder } from "@/lib/services/orderService";
import { OrderData } from "@/types/order";

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

// Updated interface for order data

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
    locale: (formData.get("locale") as "ar" | "fr") || "fr",
    // Get products data (JSON string)
    productsData: formData.get("productsData") as string,
  };

  // 2. Validate the shipping info using our Zod schema
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

  // 4. Parse and validate products data
  let products;
  try {
    products = JSON.parse(data.productsData);
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Invalid products data");
    }
  } catch (error) {
    console.error("Failed to parse products data:", error);
    return {
      message: messages[data.locale].error,
    };
  }

  // 5. Calculate total amount
  const totalAmount = products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  // 6. Prepare order data
  const orderData: OrderData = {
    products,
    shippingInfo: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      address: parsed.data.address,
    },
    orderDate: new Date().toISOString(),
    totalAmount,
    locale: data.locale,
  };

  // 7. If validation succeeds, call the Firebase service
  try {
    await createGuestOrder(orderData);

    // Optional: Revalidate a path if you have a page that lists orders
    // revalidatePath('/admin/orders');

    // 8. Return a success message
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
