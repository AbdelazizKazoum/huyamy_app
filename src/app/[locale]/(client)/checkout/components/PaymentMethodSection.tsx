"use client";

import { CreditCard, Truck, Loader2 } from "lucide-react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMemo, useState } from "react";
import { Language } from "@/types";
import { useOrderStore } from "@/store/useOrderStore";
import { toast } from "react-hot-toast";

// Load Stripe outside of the component
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface ShippingFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  email?: string;
}

interface SecureStripeFormProps {
  onPaymentSuccess: (paymentIntentId: string) => void;
  shippingInfo: ShippingFormData | null;
  clientSecret: string;
  t: (key: string) => string;
}

const SecureStripeForm = ({
  onPaymentSuccess,
  shippingInfo,
  clientSecret,
  t,
}: SecureStripeFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { loading: isProcessing, setLoading } = useOrderStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!shippingInfo) {
      toast.error(t("validation.shippingFormInvalid"));
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const paymentIntentId = clientSecret.split("_secret")[0];
      const updateRes = await fetch("/api/update-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntentId,
          shippingInfo: shippingInfo,
        }),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        console.error("Failed to update payment intent:", errorData);
        throw new Error("Failed to save shipping info before payment.");
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message || t("paymentErrorDefault"));
        } else {
          setErrorMessage(t("paymentErrorDefault"));
        }
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent.id);
      } else {
        setErrorMessage(t("paymentErrorDefault"));
        setLoading(false);
      }
    } catch (error) {
      console.error("Stripe submission error:", error);
      setErrorMessage((error as Error).message || t("paymentErrorDefault"));
      setLoading(false);
    }
  };

  return (
    <form id="stripe-payment-form" onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-primary-700 mb-3">
        {t("cardDetailsTitle")}
      </p>

      <PaymentElement />

      {errorMessage && (
        <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
      )}

      <p className="text-xs text-slate-500 mt-3 text-center">
        {t("securedByStripe")}
      </p>

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

interface PaymentMethodSectionProps {
  t: (key: string) => string;
  paymentMethod: "cod" | "card";
  setPaymentMethod: (method: "cod" | "card") => void;
  clientSecret: string | undefined;
  isStripeFormLoading: boolean;
  subtotal: number;
  locale: Language;
  onPaymentSuccess: (paymentIntentId: string) => void;
  shippingInfo: ShippingFormData | null;
}

export default function PaymentMethodSection({
  t,
  paymentMethod,
  setPaymentMethod,
  clientSecret,
  isStripeFormLoading,
  subtotal,
  locale,
  onPaymentSuccess,
  shippingInfo,
}: PaymentMethodSectionProps) {
  const stripeOptions: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      locale: locale as "ar" | "fr",
      appearance: {
        theme: "stripe",
      },
    }),
    [clientSecret, locale]
  );

  return (
    <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-primary-800" />
        {t("paymentMethodTitle")}
      </h2>
      <div className="space-y-4">
        {/* Credit Card Option */}
        <label
          onClick={() => setPaymentMethod("card")}
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === "card"
              ? "border-primary-800 bg-primary-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
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
            <p className="font-semibold text-slate-800">{t("paymentCard")}</p>
            <p className="text-sm text-slate-500">{t("paymentCardHint")}</p>
          </div>
          <div className="flex items-center gap-1">
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

        {/* Stripe Form */}
        {paymentMethod === "card" && (
          <div className="pt-4">
            {isStripeFormLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-800" />
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <SecureStripeForm
                  onPaymentSuccess={onPaymentSuccess}
                  shippingInfo={shippingInfo}
                  clientSecret={clientSecret}
                  t={t}
                />
              </Elements>
            ) : (
              <p className="text-center text-red-600">
                {t("paymentInitError")}
              </p>
            )}
          </div>
        )}

        {/* Cash on Delivery Option */}
        <label
          onClick={() => setPaymentMethod("cod")}
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === "cod"
              ? "border-primary-800 bg-primary-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
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
  );
}
