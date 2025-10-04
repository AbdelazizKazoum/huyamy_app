"use client";

import { Language } from "@/types";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { createOrderAction } from "@/lib/actions/order";
import { useTranslations, useLocale } from "next-intl";

const initialState = {
  message: "",
  errors: {},
};

// A separate component for the button to use the `useFormStatus` hook.
const SubmitButton = ({ lang }: { lang: Language }) => {
  const { pending } = useFormStatus();
  const t = useTranslations("checkout");

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-800 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-green-900 transition-all duration-300 relative overflow-hidden disabled:bg-gray-500 disabled:cursor-not-allowed"
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
  );
};

export const CheckoutForm: React.FC<{ lang: Language }> = ({ lang }) => {
  const [state, formAction] = useActionState(createOrderAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations("checkout");
  const locale = useLocale();

  // Effect to reset the form after a successful submission
  useEffect(() => {
    if (state.message && !state.errors) {
      formRef.current?.reset();
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

      <div className="text-center font-semibold h-6">
        {state.message && (
          <p className={`${!state.errors ? "text-green-600" : "text-red-500"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
};

export default CheckoutForm;
