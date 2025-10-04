"use client";

import { Language } from "@/types";
import { ShoppingCart, Loader2, CheckCircle, X, Home } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { createOrderAction } from "@/lib/actions/order";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import SuccessModal from "../modals/CheckoutSuccessModal";

const initialState = {
  message: "",
  errors: {},
};

// A separate component for the button to use the `useFormStatus` hook.
const SubmitButton = ({ lang }: { lang: Language }) => {
  const { pending } = useFormStatus();
  const t = useTranslations("checkout");

  return (
    <>
      {/* Add the animations styles */}
      <style jsx>{`
        @keyframes ring {
          0% {
            transform: rotate(0);
          }
          1% {
            transform: rotate(15deg);
          }
          3% {
            transform: rotate(-14deg);
          }
          5% {
            transform: rotate(17deg);
          }
          7% {
            transform: rotate(-16deg);
          }
          9% {
            transform: rotate(15deg);
          }
          11% {
            transform: rotate(-14deg);
          }
          13% {
            transform: rotate(13deg);
          }
          15% {
            transform: rotate(-12deg);
          }
          17% {
            transform: rotate(12deg);
          }
          19% {
            transform: rotate(-10deg);
          }
          21% {
            transform: rotate(9deg);
          }
          23% {
            transform: rotate(-8deg);
          }
          25% {
            transform: rotate(7deg);
          }
          27% {
            transform: rotate(-5deg);
          }
          29% {
            transform: rotate(5deg);
          }
          31% {
            transform: rotate(-4deg);
          }
          33% {
            transform: rotate(3deg);
          }
          35% {
            transform: rotate(-2deg);
          }
          37% {
            transform: rotate(1deg);
          }
          39% {
            transform: rotate(-1deg);
          }
          41% {
            transform: rotate(1deg);
          }
          43% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(0);
          }
        }
        .animate-ring {
          animation: ring 3s ease-in-out 0.7s infinite;
        }

        @keyframes slide-right-left {
          0%,
          100% {
            transform: translateX(5px);
          }
          50% {
            transform: translateX(-5px);
          }
        }
        .animate-slide {
          animation: slide-right-left 2.5s ease-in-out infinite;
        }

        @keyframes shiny-effect {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          100% {
            transform: translateX(250%) skewX(-25deg);
          }
        }
        .animate-shiny::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shiny-effect 3s infinite linear;
        }
      `}</style>

      <button
        type="submit"
        disabled={pending}
        className={`w-full cursor-pointer bg-green-800 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-green-900 transition-all duration-300 relative overflow-hidden disabled:bg-gray-500 disabled:cursor-not-allowed ${
          !pending ? "animate-slide animate-shiny" : ""
        }`}
      >
        <span className="flex items-center justify-center">
          {pending ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              {t("processing")}
            </>
          ) : (
            <>
              {t("buyNowButton")}
              <ShoppingCart
                className={
                  lang === "ar" ? "mr-3 animate-ring" : "ml-3 animate-ring"
                }
                size={24}
              />
            </>
          )}
        </span>
      </button>
    </>
  );
};

export const CheckoutForm: React.FC<{ lang: Language }> = ({ lang }) => {
  const [state, formAction] = useActionState(createOrderAction, initialState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations("checkout");
  const locale = useLocale();

  // Effect to handle success state
  useEffect(() => {
    if (state.message && !state.errors) {
      // Check if it's a success message
      if (
        state.message.includes("🎉") ||
        state.message.includes("confirmée") ||
        state.message.includes("تأكيد")
      ) {
        setShowSuccessModal(true);
        formRef.current?.reset();
      }
    }
  }, [state]);

  // Function to get localized error message
  const getErrorMessage = (
    field: "fullName" | "phone" | "address",
    errors: string[]
  ) => {
    // Map validation errors to localized messages
    if (
      errors[0].includes("at least 3 characters") ||
      errors[0].includes("3 characters")
    ) {
      return t("validation.fullNameRequired");
    }
    if (errors[0].includes("valid phone number") || errors[0].includes("10")) {
      return t("validation.phoneRequired");
    }
    if (
      errors[0].includes("at least 5 characters") ||
      errors[0].includes("5 characters")
    ) {
      return t("validation.addressRequired");
    }

    // Field-specific fallbacks
    switch (field) {
      case "fullName":
        return t("validation.fullNameRequired");
      case "phone":
        return t("validation.phoneRequired");
      case "address":
        return t("validation.addressRequired");
      default:
        return errors[0];
    }
  };

  return (
    <>
      {/* Add placeholder focus styles */}
      <style jsx>{`
        input:focus::placeholder {
          color: transparent;
        }
      `}</style>

      <form ref={formRef} action={formAction} className="space-y-4">
        {/* Hidden input to pass locale to server action */}
        <input type="hidden" name="locale" value={locale} />

        <div className="bg-white p-6 rounded-3xl shadow-2xl border-[5px] border-green-700 space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-800">
            {t("customerInfo")}
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <input
                type="text"
                name="fullName"
                placeholder={t("fullNamePlaceholder")}
                className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
              />
              {state.errors?.fullName && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {getErrorMessage("fullName", state.errors.fullName)}
                </p>
              )}
            </div>

            <div className="w-full">
              <input
                type="text"
                name="phone"
                placeholder={t("phonePlaceholder")}
                className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
              />
              {state.errors?.phone && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {getErrorMessage("phone", state.errors.phone)}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="address"
              placeholder={t("addressPlaceholder")}
              className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
            />
            {state.errors?.address && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {getErrorMessage("address", state.errors.address)}
              </p>
            )}
          </div>
        </div>

        <SubmitButton lang={lang} />

        {/* Error Message Display */}
        {state.message && state.errors && (
          <div className="text-center font-semibold h-6">
            <p className="text-red-500">{state.message}</p>
          </div>
        )}
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={state.message}
        lang={lang}
      />
    </>
  );
};

export default CheckoutForm;
