"use client";

// --- Original Imports ---
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { OrderData } from "@/types/order";
import { toast } from "react-hot-toast";
import {
  User,
  Phone,
  MapPin,
  Home,
  Mail,
  ClipboardList,
  Truck,
  Wallet,
  Contact,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Loader2, // <-- Import Loader2 icon
} from "lucide-react";
import { ButtonPrimary } from "@/components/ui";
import SuccessModal from "@/components/modals/CheckoutSuccessModal";
import { Language } from "@/types";
import { Link } from "@/i18n/config";

// --- 1. Stripe Imports ---
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// --- 2. Load Stripe Promise ---
// Load Stripe outside of the component to avoid re-renders.
// Use your *public* key from .env.local
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

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

/**
 * --- 3. Secure Stripe Form Component ---
 * We create a new component to handle the payment logic.
 * It *must* be a child of the <Elements> provider to use Stripe hooks.
 */
const SecureStripeForm = ({
  onPaymentSuccess,
}: {
  onPaymentSuccess: (paymentIntentId: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations("checkout");

  // Get loading state from your order store
  const { loading: isProcessing, setLoading } = useOrderStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setLoading(true); // Use your Zustand store to set loading
    setErrorMessage(null);

    // Trigger the payment confirmation
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      // We use 'if_required' to handle the result here
      // instead of redirecting the user.
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || t("paymentErrorDefault"));
      } else {
        setErrorMessage(t("paymentErrorDefault"));
      }
      setLoading(false); // Stop loading on error
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment was successful!
      // Call the parent function to save the order to *our* database.
      onPaymentSuccess(paymentIntent.id);
      // The parent will set loading to false *after* saving the order.
    } else {
      setErrorMessage(t("paymentErrorDefault"));
      setLoading(false);
    }
  };

  return (
    // This form's ID will be targeted by our main "Pay Now" button
    <form id="stripe-payment-form" onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-primary-700 mb-3">
        {t("cardDetailsTitle")}
      </p>

      {/* This one component replaces your entire manual card form.
          It's a secure iframe controlled by Stripe. */}
      <PaymentElement />

      {errorMessage && (
        <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
      )}

      <p className="text-xs text-slate-500 mt-3 text-center">
        {t("securedByStripe")}
      </p>

      {/* This button is hidden. The *real* button is in the summary column. */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="hidden"
      >
        Submit
      </button>
    </form>
  );
};

// --- Main CheckoutPage Component ---
const CheckoutPage = () => {
  const t = useTranslations("checkout");
  const tValidation = useTranslations("checkout.validation");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Language;

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");

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
    // Payment is DONE. Now create the order in our database.
    const shippingData = getValues(); // Get validated shipping data
    const orderData = createOrderDataObject(
      shippingData,
      "card",
      paymentIntentId
    );

    // setLoading(true) was already called in SecureStripeForm
    try {
      await createOrder(orderData); // Save to your Firebase DB via Zustand
      clearCart();
      setIsSuccessModalOpen(true); // Show your success modal
    } catch (error) {
      // CRITICAL ERROR: Payment was taken but order save failed.
      // This is a serious issue that requires manual intervention
      console.error("CRITICAL: Payment succeeded but order save failed:", {
        paymentIntentId,
        orderData,
        error: error instanceof Error ? error.message : error,
        timestamp: new Date().toISOString(),
      });

      // Show error modal instead of success
      toast.error(t("orderSaveError"));
      // Don't show success modal - payment was taken but order wasn't saved
      // This will be handled by customer support for manual reconciliation

      // TODO: Implement webhook-based order creation for better reliability
      // The payment was successful, but we couldn't save the order.
      // In production, use Stripe webhooks to create orders reliably.
    } finally {
      setLoading(false); // Final loading stop
    }
  };

  // --- 7. Create Smart Submit Handler ---
  // This function validates the shipping form *before*
  // trying to submit either COD or Card payment.
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
    const shippingData = getValues();

    if (paymentMethod === "cod") {
      // If COD, run the COD logic
      await onCodSubmit(shippingData);
    } else if (paymentMethod === "card") {
      // If Card, find the hidden Stripe form's submit button and click it
      const stripeSubmitButton = document.querySelector(
        '#stripe-payment-form button[type="submit"]'
      ) as HTMLButtonElement | null;

      if (stripeSubmitButton) {
        stripeSubmitButton.click();
      } else {
        toast.error(t("paymentErrorDefault"));
      }
    }
  };

  // Stripe Elements options
  const stripeOptions: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      locale: locale as "ar" | "fr", // Set Stripe locale based on current locale
      appearance: {
        theme: "stripe",
        // You can customize the theme here
        // See: https://stripe.com/docs/elements/appearance-api
      },
    }),
    [clientSecret, locale]
  );

  // Loading Skeleton UI (unchanged)
  if (isHydrating) {
    return (
      <div className="bg-white">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Skeleton */}
          <div className="mb-12 ltr:text-left rtl:text-right">
            <div className="h-10 w-1/3 bg-slate-200 rounded-lg animate-pulse mb-3"></div>
            <div className="h-6 w-1/2 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:items-start">
            {/* Left Column: Shipping & NEW Payment */}
            <div className="lg:col-span-7 space-y-8 lg:sticky lg:top-24">
              {/* Card 1: Shipping Information Form */}
              <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
              {/* Payment Form Skeleton */}
              <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-20 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="h-20 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
            {/* Summary Skeleton (Right Column) */}
            <div className="lg:col-span-5 mt-10 lg:mt-0">
              <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                  <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-4 mb-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="h-16 w-16 bg-slate-200 rounded-lg animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <div className="h-5 w-12 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart message (unchanged)
  if (items.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
          <ShoppingBag size={48} className="text-slate-400" strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-800">
          {t("empty.title")}
        </h1>
        <p className="mt-2 text-lg text-slate-500">{t("empty.description")}</p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-primary-800 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary-900 transition-all duration-300"
        >
          {t("empty.startShopping")}
        </Link>
      </div>
    );
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
              <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Contact className="h-6 w-6 text-primary-800" />
                  {t("shippingTitle")}
                </h2>
                <form
                  id="shipping-form"
                  // We don't use onSubmit here, we trigger manually
                  className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6"
                >
                  {/* Form fields are unchanged... */}
                  <div>
                    <Input
                      label={`${t("fullName")} *`}
                      icon={<User className="h-4 w-4 text-slate-400" />}
                      {...register("fullName")}
                      error={errors.fullName?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label={`${t("phone")} *`}
                      icon={<Phone className="h-4 w-4 text-slate-400" />}
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label={`${t("city")} *`}
                      icon={<MapPin className="h-4 w-4 text-slate-400" />}
                      {...register("city")}
                      error={errors.city?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label={`${t("address")} *`}
                      icon={<Home className="h-4 w-4 text-slate-400" />}
                      {...register("address")}
                      error={errors.address?.message}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label={`${t("email")} (${t("optional")})`}
                      icon={<Mail className="h-4 w-4 text-slate-400" />}
                      type="email"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </div>
                </form>
              </div>

              {/* Card 2: NEW Payment Method Section */}
              <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary-800" />
                  {t("paymentMethodTitle")}
                </h2>
                <div className="space-y-4">
                  {/* Option 1: Credit Card */}
                  <label
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-primary-800 bg-primary-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* (radio button UI) */}
                    <div
                      className={`w-5 h-5 border-2 rounded-full grid place-items-center transition-all ${
                        paymentMethod === "card"
                          ? "border-primary-800"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "card" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-800 transition-all" />
                      )}
                    </div>
                    <div className="ltr:ml-4 rtl:mr-4 flex-grow">
                      <p className="font-semibold text-slate-800">
                        {t("paymentCard")}
                      </p>
                      <p className="text-sm text-slate-500">
                        {t("paymentCardHint")}
                      </p>
                    </div>
                    {/* (card logos) */}
                    <div className="flex items-center gap-1">
                      {/* Inline Visa SVG (use JSX SVG like Mastercard) */}
                      <span className="rounded-sm overflow-hidden">
                        <svg
                          width={32}
                          height={20}
                          viewBox="0 0 32 20"
                          className="h-5 w-auto"
                          preserveAspectRatio="xMidYMid meet"
                          role="img"
                          aria-label="Visa"
                        >
                          <rect width="32" height="20" rx="3" fill="#1428A0" />
                          <g
                            fill="#fff"
                            fontFamily="Arial, Helvetica, sans-serif"
                            fontWeight="700"
                            fontSize="8"
                            textAnchor="middle"
                          >
                            <text x="16" y="13">
                              VISA
                            </text>
                          </g>
                        </svg>
                      </span>

                      <span
                        role="img"
                        aria-label="Mastercard"
                        className="rounded-sm overflow-hidden"
                      >
                        <svg
                          width={32}
                          height={20}
                          viewBox="0 0 32 20"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-auto"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <rect width="32" height="20" rx="3" fill="#EFEFEF" />
                          <g transform="translate(6,2)">
                            <circle cx="6" cy="8" r="6" fill="#FF5F00" />
                            <circle cx="14" cy="8" r="6" fill="#EB001B" />
                            {/* middle overlap visual */}
                            <ellipse
                              cx="10"
                              cy="8"
                              rx="3.8"
                              ry="6"
                              fill="#FF9900"
                              opacity="0.95"
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                  </label>

                  {/* --- 8. Render Stripe Form --- */}
                  {paymentMethod === "card" && (
                    <div className="p-4 border-2 border-primary-200 bg-primary-50 rounded-lg">
                      {isStripeFormLoading && (
                        <div className="h-24 flex items-center justify-center text-primary-700">
                          <p>{t("loadingPaymentForm")}...</p>
                        </div>
                      )}
                      {clientSecret && (
                        <Elements
                          options={stripeOptions}
                          stripe={stripePromise}
                        >
                          <SecureStripeForm
                            onPaymentSuccess={onCardPaymentSuccess}
                          />
                        </Elements>
                      )}
                      {!clientSecret &&
                        !isStripeFormLoading &&
                        items.length > 0 && (
                          <div className="h-24 flex items-center justify-center text-red-700">
                            <p>{t("paymentInitError")}</p>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Option 2: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-primary-800 bg-primary-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* (radio button UI) */}
                    <div
                      className={`w-5 h-5 border-2 rounded-full grid place-items-center transition-all ${
                        paymentMethod === "cod"
                          ? "border-primary-800"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-800 transition-all" />
                      )}
                    </div>
                    <div className="ltr:ml-4 rtl:mr-4 flex-grow">
                      <p className="font-semibold text-slate-800">{t("cod")}</p>
                      <p className="text-sm text-slate-500">{t("codHint")}</p>
                    </div>
                    <Truck className="h-6 w-6 text-slate-500" />
                  </label>

                  {paymentMethod === "cod" && (
                    <div className="p-4 border-2 border-slate-200 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700">
                        {t("codInfo")}{" "}
                        <strong className="text-slate-900">
                          {subtotal.toFixed(2)} {t("currency")}
                        </strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-5 mt-10 lg:mt-0 lg:sticky lg:top-24">
              <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
                <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4 flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-primary-800" />
                  {t("summaryTitle")}
                </h2>
                {/* Item mapping is unchanged... */}
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemPrice =
                      item.selectedVariant?.price ?? item.product.price;
                    const itemImage =
                      item.selectedVariant?.images?.[0] ?? item.product.image;

                    return (
                      <div
                        key={item.cartItemId}
                        className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <Image
                          src={itemImage}
                          alt={item.product.name[locale]}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-slate-800 leading-tight">
                            {item.product.name[locale]}
                          </p>
                          {/* (variant & quantity display) */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                            {item.selectedVariant &&
                              Object.entries(item.selectedVariant.options).map(
                                ([optionKey, optionValue]) => {
                                  // This part assumes you have access to the display name
                                  // We'll just use the key for now.
                                  return (
                                    <span key={optionKey}>
                                      {optionKey}:{" "}
                                      <span className="font-medium text-slate-600">
                                        {optionValue}
                                      </span>
                                    </span>
                                  );
                                }
                              )}

                            {item.selectedVariant && (
                              <span className="text-slate-300">|</span>
                            )}

                            <span>
                              {t("quantityLabel")}:{" "}
                              <span className="font-medium text-slate-600">
                                {item.quantity}
                              </span>
                            </span>
                          </div>
                        </div>
                        <p className="font-medium text-slate-800 whitespace-nowrap">
                          {(itemPrice * item.quantity).toFixed(2)}{" "}
                          {t("currency")}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* Summary details (unchanged) */}
                <dl className="space-y-3 text-slate-600 border-t border-slate-200 mt-4 pt-4">
                  <div className="flex items-center justify-between font-medium">
                    <dt className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-slate-500" />
                      {t("subtotal")}
                    </dt>
                    <dd className="text-slate-800">
                      {subtotal.toFixed(2)} {t("currency")}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <dt className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-slate-500" />
                      {t("shipping")}
                    </dt>
                    <dd className="text-slate-800">
                      {paymentMethod === "cod" ? t("cod") : t("paymentCard")}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-xl font-bold border-t border-slate-200 pt-4 mt-4">
                    <dt className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-slate-800" />
                      {t("total")}
                    </dt>
                    <dd className="text-primary-800">
                      {subtotal.toFixed(2)} {t("currency")}
                    </dd>
                  </div>
                </dl>

                {/* --- 9. Final Button Logic (TYPO FIXED) --- */}
                <ButtonPrimary
                  type="button"
                  onClick={handleSmartSubmit}
                  disabled={
                    isCreatingOrder ||
                    isStripeFormLoading ||
                    (paymentMethod === "card" && !clientSecret) ||
                    items.length === 0
                  }
                  className="w-full text-lg py-3 mt-6 flex items-center justify-center gap-x-2.5 disabled:opacity-70 disabled:cursor-not-allowed" // Added disabled styles
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>
                        {paymentMethod === "card"
                          ? t("processingPayment")
                          : t("placingOrder")}
                      </span>
                    </>
                  ) : paymentMethod === "card" ? (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>
                        {t("payNow")} {subtotal.toFixed(2)} {t("currency")}
                      </span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5" />
                      <span>{t("placeOrder")}</span>
                    </>
                  )}
                </ButtonPrimary>
              </div>
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
