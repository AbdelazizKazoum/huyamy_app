"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { Locale } from "@/types";
import { CartItem } from "@/types/cart";
import CartItemComponent from "./CartItem";

interface CartItemsListProps {
  items: CartItem[];
  locale: Locale;
  t: (key: string) => string;
  isAllSelected: boolean;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleItemSelected: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
}

export default function CartItemsList({
  items,
  locale,
  t,
  isAllSelected,
  onToggleSelectAll,
  onToggleItemSelected,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsListProps) {
  return (
    <div className="lg:col-span-2">
      <div className="container max-w-3xl mx-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                onToggleSelectAll(!!checked)
              }
            />
            <label htmlFor="select-all" className="font-medium text-slate-700">
              {isAllSelected ? t("deselectAll") : t("selectAll")} (
              {items.length})
            </label>
          </div>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemComponent
              key={item.cartItemId}
              item={item}
              locale={locale}
              t={t}
              onToggleSelect={onToggleItemSelected}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
