"use client";

import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/config";
import {
  Minus,
  Plus,
  ShoppingCart,
  X,
  ClipboardList,
  Truck,
  Wallet,
} from "lucide-react"; // Import new icons
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/ui";

const CartPage = () => {
  const t = useTranslations("cart");
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCartStore();
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    setIsHydrating(false);
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items]
  );

  // Loading Skeleton UI
  if (isHydrating) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Header Skeleton */}
          <div className="mb-10">
            <div className="h-9 w-1/3 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-7 w-1/4 bg-slate-200 rounded-lg mt-2 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
            {/* Cart Items Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-md border border-slate-200/80"
                >
                  <div className="w-20 h-20 bg-slate-200 rounded-lg animate-pulse"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-5 w-3/4 bg-slate-200 rounded-md animate-pulse"></div>
                  </div>
                  <div className="h-8 w-24 bg-slate-200 rounded-md animate-pulse"></div>
                  <div className="h-6 w-24 bg-slate-200 rounded-md animate-pulse"></div>
                  <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Order Summary Skeleton */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
                <div className="h-8 w-3/4 bg-slate-200 rounded-md animate-pulse"></div>
                <div className="space-y-4 mt-6">
                  <div className="flex justify-between">
                    <div className="h-5 w-1/4 bg-slate-200 rounded-md animate-pulse"></div>
                    <div className="h-5 w-1/3 bg-slate-200 rounded-md animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-5 w-1/3 bg-slate-200 rounded-md animate-pulse"></div>
                    <div className="h-5 w-1/2 bg-slate-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
                <div className="border-t border-slate-200 mt-6 pt-6">
                  <div className="h-12 w-full bg-slate-300 rounded-md animate-pulse"></div>
                  <div className="h-6 w-1/2 mx-auto bg-slate-200 rounded-md animate-pulse mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
          <ShoppingCart
            size={48}
            className="text-slate-400"
            strokeWidth={1.5}
          />
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
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 ltr:text-left rtl:text-right">
          <h1 className="text-3xl font-bold text-slate-800">{t("title")}</h1>
          <p className="mt-1 text-lg text-slate-500">{t("pageSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-md border border-slate-200/80"
              >
                <Image
                  src={item.product.image}
                  alt={item.product.name["ar"]}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-base text-slate-800">
                    {item.product.name["ar"]}
                  </h3>
                </div>
                <div className="flex items-center border border-slate-200 rounded-md">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 font-bold text-slate-800 text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="p-1.5 text-slate-500 hover:bg-slate-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="w-24 text-center font-bold text-slate-800 text-base">
                  {(item.product.price * item.quantity).toFixed(2)}{" "}
                  {t("currency")}
                </p>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 text-slate-400 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80 sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-4 flex items-center gap-3">
                <ClipboardList className="h-6 w-6 text-primary-800" />
                {t("orderSummary")}
              </h2>
              <dl className="space-y-3 text-slate-600">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-slate-500" />
                    {t("subtotal")}
                  </dt>
                  <dd className="font-semibold text-slate-800">
                    {subtotal.toFixed(2)} {t("currency")}
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
                  <dt className="flex items-center gap-2 text-slate-900">
                    <Wallet className="h-5 w-5 text-slate-800" />
                    {t("total")}
                  </dt>
                  <dd className="text-slate-900">
                    {subtotal.toFixed(2)} {t("currency")}
                  </dd>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <ButtonPrimary
                  disabled={items.length === 0}
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
        </div>
      </div>
    </div>
  );
};

export default CartPage;
