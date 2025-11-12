"use client";

import Image from "next/image";
import { ShoppingCart, ClipboardList, Truck, Wallet } from "lucide-react";
import { ButtonPrimary } from "@/components/ui";
import { Language } from "@/types";
import { Loader2, CreditCard } from "lucide-react";
import { CartItem } from "@/types/cart";

interface OrderSummaryProps {
  t: (key: string) => string;
  items: CartItem[];
  subtotal: number;
  paymentMethod: "cod" | "card";
  locale: Language;
  isCreatingOrder: boolean;
  isStripeFormLoading: boolean;
  clientSecret: string | undefined;
  onSubmit: () => void;
}

export default function OrderSummary({
  t,
  items,
  subtotal,
  paymentMethod,
  locale,
  isCreatingOrder,
  isStripeFormLoading,
  clientSecret,
  onSubmit,
}: OrderSummaryProps) {
  return (
    <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
      <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4 flex items-center gap-3">
        <ShoppingCart className="h-6 w-6 text-primary-800" />
        {t("summaryTitle")}
      </h2>
      <div className="space-y-4">
        {items.map((item) => {
          const itemPrice = item.selectedVariant?.price ?? item.product.price;
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
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  {item.selectedVariant &&
                    Object.entries(item.selectedVariant.options).map(
                      ([optionKey, optionValue]) => (
                        <span key={optionKey}>
                          {optionKey}:{" "}
                          <span className="font-medium text-slate-600">
                            {optionValue}
                          </span>
                        </span>
                      )
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
                {(itemPrice * item.quantity).toFixed(2)} {t("currency")}
              </p>
            </div>
          );
        })}
      </div>
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

      <ButtonPrimary
        type="button"
        onClick={onSubmit}
        disabled={
          isCreatingOrder ||
          isStripeFormLoading ||
          (paymentMethod === "card" && !clientSecret) ||
          items.length === 0
        }
        className="w-full text-lg py-3 mt-6 flex items-center justify-center gap-x-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
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
  );
}
