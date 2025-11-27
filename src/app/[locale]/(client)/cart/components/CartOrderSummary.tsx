"use client";

import { ShoppingCart, ClipboardList, Truck } from "lucide-react";
import { ButtonPrimary } from "@/components/ui";
import { Link } from "@/i18n/config";
import { useRouter } from "next/navigation";
import { useConfig } from "@/hooks/useConfig";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { Language } from "@/types";

interface CartOrderSummaryProps {
  t: (key: string) => string;
  selectedItemsCount: number;
  subtotal: number;
}

export default function CartOrderSummary({
  t,
  selectedItemsCount,
  subtotal,
}: CartOrderSummaryProps) {
  const router = useRouter();
  const locale = useLocale() as Language;

  // Get currency from config using the hook (fetches if not exists)
  const { config } = useConfig();
  const currency =
    config?.currencies?.[locale] || siteConfig.currencies[locale];

  return (
    <div className="lg:col-span-1 mt-8 lg:mt-0">
      <div className="bg-white p-6 rounded-xl shadow-md border-slate-200/80 sticky top-24">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-4 flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-primary-800" />
          {t("orderSummary")}
        </h2>
        <dl className="space-y-3 text-slate-600">
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-slate-500" />
              {t("subtotal")} ({selectedItemsCount} {t("items")})
            </dt>
            <dd className="font-semibold text-slate-800">
              {subtotal.toFixed(2)} {currency}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-slate-500" />
              {t("shipping")}
            </dt>
            <dd className="font-medium">{t("calculatedAtCheckout")}</dd>
          </div>
        </dl>
        <div className="border-t border-slate-200 mt-4 pt-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-slate-800">{t("total")}</span>
            <span className="text-green-600">
              {subtotal.toFixed(2)} {currency}
            </span>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <ButtonPrimary
            disabled={selectedItemsCount === 0}
            className="w-full text-lg py-3"
            onClick={() => router.push("/checkout")}
          >
            {t("completePurchase")}
          </ButtonPrimary>
          <div className="text-center">
            <Link
              href="/products"
              className="text-slate-600 hover:text-primary-800 font-medium"
            >
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
