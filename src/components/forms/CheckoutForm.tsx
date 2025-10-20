"use client";

import { Language, Product } from "@/types";
import { ShoppingCart, Loader2 } from "lucide-react";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { createOrderAction } from "@/lib/actions/order";
import { useTranslations, useLocale } from "next-intl";
import SuccessModal from "../modals/CheckoutSuccessModal";
import SubmitButton from "./SubmitButton";

const initialState = {
  message: "",
  errors: {},
};

// Updated interface for checkout form props
interface CheckoutFormProps {
  lang: Language;
  products?: Product[]; // For multiple products (cart/checkout page)
  product?: Product; // For single product (product detail page)
  quantities?: Record<string, number>; // For cart quantities
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  lang,
  products,
  product,
  quantities = {},
}) => {
  const [state, formAction] = useActionState(createOrderAction, initialState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations("checkout");
  const locale = useLocale();

  // Prepare products data for the order
  const orderProducts = React.useMemo(() => {
    if (products) {
      // Multiple products (from cart/checkout page)
      return products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: quantities[p.id] || 1,
        image: p.image,
      }));
    } else if (product) {
      // Single product (from product detail page)
      return [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    }
    return [];
  }, [products, product, quantities]);

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

        {/* Hidden input to pass products data to server action */}
        <input
          type="hidden"
          name="productsData"
          value={JSON.stringify(orderProducts)}
        />

        <div className="bg-white p-6 rounded-3xl shadow-2xl border-[5px] border-primary-700 space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-800">
            {t("customerInfo")}
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <input
                type="text"
                name="fullName"
                placeholder={t("fullNamePlaceholder")}
                className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 text-center"
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
                className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 text-center"
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
              className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 text-center"
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
