"use client";

import { useCartStore } from "@/store/useCartStore";
import { useTranslations, useLocale } from "next-intl";
import { useMemo, useState, useEffect } from "react";
import { Locale } from "@/types";

// --- Component Imports ---
import CartSkeleton from "./components/CartSkeleton";
import EmptyCartMessage from "./components/EmptyCartMessage";
import CartItemsList from "./components/CartItemsList";
import CartOrderSummary from "./components/CartOrderSummary";

const CartPage = () => {
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;
  const {
    items,
    updateQuantity,
    removeItem,
    toggleItemSelected,
    toggleSelectAll,
  } = useCartStore();
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    setIsHydrating(false);
  }, []);

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce((acc, item) => {
        const price = item.selectedVariant?.price ?? item.product.price;
        return acc + price * item.quantity;
      }, 0),
    [selectedItems]
  );

  const isAllSelected =
    items.length > 0 && selectedItems.length === items.length;

  // Loading Skeleton UI
  if (isHydrating) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyCartMessage t={t} />;
  }

  return (
    <div className="bg-white">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 ltr:text-left rtl:text-right">
          <h1 className="text-3xl font-bold text-slate-800">{t("title")}</h1>
          <p className="mt-1 text-lg text-slate-500">{t("pageSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          <CartItemsList
            items={items}
            locale={locale}
            t={t}
            isAllSelected={isAllSelected}
            onToggleSelectAll={toggleSelectAll}
            onToggleItemSelected={toggleItemSelected}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />

          <CartOrderSummary
            t={t}
            selectedItemsCount={selectedItems.length}
            subtotal={subtotal}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
