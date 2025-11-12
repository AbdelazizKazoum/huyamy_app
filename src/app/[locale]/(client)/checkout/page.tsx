"use client";

// --- Original Imports ---
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OrderData } from "@/types/order";
import { toast } from "react-hot-toast";
import SuccessModal from "@/components/modals/CheckoutSuccessModal";
import { Language } from "@/types";

// --- Component Imports ---
import CheckoutSkeleton from "./components/CheckoutSkeleton";
import EmptyCartMessage from "./components/EmptyCartMessage";
import ShippingForm from "./components/ShippingForm";
import PaymentMethodSection from "./components/PaymentMethodSection";
import OrderSummary from "./components/OrderSummary";

// (Shipping schema is unchanged)
const createShippingSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z.string().min(3, t("fullNameRequired")),
    phone: z.string().min(10, t("phoneRequired")),
    city: z.string().min(2, t("cityRequired")),
    address: z.string().min(5, t("addressRequired")),
    email: z.string().email(t("emailInvalid")).optional().or(z.literal("")),
  });

type ShippingFormData = z.infer<ReturnType<typeof createShippingSchema>>;

// --- Main CheckoutPage Component ---
const CheckoutPage = () => {
  const t = useTranslations("checkout");
  const tValidation = useTranslations("checkout.validation");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Language;

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  // --- 4. Add Stripe-related State ---
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined
  );
  const [isStripeFormLoading, setIsStripeFormLoading] = useState(false);

  useEffect(() => {
    setIsHydrating(false);
  }, []);

  // Get data from your Zustand stores
  const allItems = useCartStore((state) => state.items);
  const { clearCart } = useCartStore();
  // Get the *real* loading state from the order store
  const { createOrder, loading: isCreatingOrder, setLoading } = useOrderStore();

  const items = useMemo(
    () => allItems.filter((item) => item.selected),
    [allItems]
  );

  const shippingSchema = createShippingSchema(tValidation);

  const {
    register,
    formState: { errors },
    getValues, // We need this to get shipping data
    trigger, // We need this to manually validate the form
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: "onChange", // Validate on change after errors appear
  });

  const subtotal = useMemo(
    () =>
      items.reduce((acc, item) => {
        const price = item.selectedVariant?.price ?? item.product.price;
        return acc + price * item.quantity;
      }, 0),
    [items]
  );

  // --- 5. Fetch Payment Intent when 'card' is selected ---
  useEffect(() => {
    if (paymentMethod === "card" && !clientSecret && subtotal > 0) {
      setIsStripeFormLoading(true);

      // Create the *secure* item list to send to the API
      // We only send IDs and quantity, NOT prices.
      const secureItems = items.map((item) => ({
        productId: item.product.id,
        variantId: item.selectedVariant?.id || null,
        quantity: item.quantity,
      }));

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: secureItems }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            console.error("Failed to get client secret:", data.error);
            toast.error(t("paymentInitError"));
          }
        })
        .catch((e) => {
          console.error("Fetch PaymentIntent error:", e);
          toast.error(t("paymentInitError"));
        })
        .finally(() => {
          setIsStripeFormLoading(false);
        });
    }
  }, [paymentMethod, clientSecret, items, subtotal, t]);

  // Helper function to create the final order object for our DB
  const createOrderDataObject = (
    shippingData: ShippingFormData,
    paymentMethod: "cod" | "card",
    paymentIntentId?: string
  ): OrderData => {
    return {
      shippingInfo: shippingData,
      products: items.map((item) => {
        // 'items' is from the outer scope
        const variantDescription = item.selectedVariant
          ? ` - ${Object.values(item.selectedVariant.options).join(" / ")}`
          : "";
        const itemPrice = item.selectedVariant?.price ?? item.product.price;
        const itemImage =
          item.selectedVariant?.images?.[0] ?? item.product.image;

        return {
          id: item.product.id,
          name: {
            ar: `${item.product.name.ar}${variantDescription}`,
            fr: `${item.product.name.fr}${variantDescription}`,
          },
          price: itemPrice,
          quantity: item.quantity,
          image: itemImage,
          variant: item.selectedVariant?.options ?? null,
        };
      }),
      totalAmount: subtotal,
      locale: locale,
      orderDate: new Date().toISOString(),
      paymentMethod,
      paymentIntentId: paymentIntentId || undefined, // Use undefined if not present
    };
  };

  // This is the COD submit logic
  const onCodSubmit = async (data: ShippingFormData) => {
    const orderData = createOrderDataObject(data, "cod");
    setLoading(true); // Use Zustand loading
    try {
      await createOrder(orderData); // This is your Zustand action
      clearCart();
      setIsSuccessModalOpen(true);
    } catch (error) {
      toast.error(t("orderErrorToast"));
      console.error("Failed to create order:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // --- 6. Handle Card Payment Success ---
  // This runs *after* Stripe confirms payment is successful
  const onCardPaymentSuccess = async (paymentIntentId: string) => {
    // setLoading(true) was already called in SecureStripeForm

    // With the webhook in place, the client's job is done.
    // The webhook will handle order creation. We just need to show success.
    console.log(
      `Client-side success for PaymentIntent: ${paymentIntentId}. Handing off to webhook.`
    );

    clearCart();
    setIsSuccessModalOpen(true); // Show your success modal
    setLoading(false); // Final loading stop
  };

  // --- 7. Create Smart Submit Handler (REFACTORED) ---
  // This function now only validates and triggers the appropriate form.
  const handleSmartSubmit = async () => {
    // 1. Manually trigger validation on the shipping form
    const isShippingValid = await trigger();

    if (!isShippingValid) {
      toast.error(t("validation.shippingFormInvalid"));
      // Delay to ensure errors are updated before accessing them
      setTimeout(() => {
        const firstError = Object.keys(errors)[0] as keyof ShippingFormData;
        const errorField = document.querySelector(
          `[name="${firstError}"]`
        ) as HTMLInputElement | null;
        if (errorField) {
          errorField.scrollIntoView({ behavior: "smooth", block: "center" });
          errorField.focus();
          errorField.select(); // Select the text in the input for better UX
        }
      }, 200); // Increased delay to ensure state update
      return;
    }

    // 2. Shipping form is valid, now check payment method
    if (paymentMethod === "cod") {
      const shippingData = getValues();
      // If COD, run the COD logic
      await onCodSubmit(shippingData);
    } else if (paymentMethod === "card") {
      // For card payments, just click the hidden button in the Stripe form.
      // The form's own handleSubmit will now manage the API call and payment confirmation.
      const stripeSubmitButton = document.querySelector(
        '#stripe-payment-form button[type="submit"]'
      ) as HTMLButtonElement | null;

      if (stripeSubmitButton) {
        stripeSubmitButton.click();
      } else {
        console.error("Stripe submit button not found.");
        toast.error(t("paymentErrorDefault"));
      }
    }
  };

  // Stripe Elements options
  // Moved to PaymentMethodSection component

  // Loading Skeleton UI (unchanged)
  if (isHydrating) {
    return <CheckoutSkeleton />;
  }

  // Empty cart message (unchanged)
  if (items.length === 0 && !isSuccessModalOpen) {
    return <EmptyCartMessage t={t} />;
  }

  return (
    <>
      <div className="bg-white">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 ltr:text-left rtl:text-right">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-2 text-lg text-slate-600">{t("pageSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:items-start">
            {/* Left Column: Shipping & NEW Payment */}
            <div className="lg:col-span-7 space-y-8 lg:sticky lg:top-24">
              {/* Card 1: Shipping Information Form */}
              <ShippingForm t={t} register={register} errors={errors} />

              {/* Card 2: NEW Payment Method Section */}
              <PaymentMethodSection
                t={t}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                clientSecret={clientSecret}
                isStripeFormLoading={isStripeFormLoading}
                subtotal={subtotal}
                locale={locale}
                onPaymentSuccess={onCardPaymentSuccess}
                shippingInfo={getValues()}
              />
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-5 mt-10 lg:mt-0 lg:sticky lg:top-24">
              <OrderSummary
                t={t}
                items={items}
                subtotal={subtotal}
                paymentMethod={paymentMethod}
                locale={locale}
                isCreatingOrder={isCreatingOrder}
                isStripeFormLoading={isStripeFormLoading}
                clientSecret={clientSecret}
                onSubmit={handleSmartSubmit}
              />
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push(`/${locale}/products`);
        }}
        message={
          paymentMethod === "card"
            ? t("orderSuccessMessageCard")
            : t("orderSuccessMessage")
        }
        lang={locale}
      />
    </>
  );
};

export default CheckoutPage;
