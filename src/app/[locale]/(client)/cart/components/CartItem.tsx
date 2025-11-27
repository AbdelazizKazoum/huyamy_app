"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Locale } from "@/types";
import { CartItem } from "@/types/cart";
import { useConfig } from "@/hooks/useConfig";
import { siteConfig } from "@/config/site";

interface CartItemProps {
  item: CartItem;
  locale: Locale;
  t: (key: string) => string;
  onToggleSelect: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export default function CartItemComponent({
  item,
  locale,
  t,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  // Get currency from config using the hook (fetches if not exists)
  const { config } = useConfig();
  const currency =
    config?.currencies?.[locale] || siteConfig.currencies[locale];

  const itemPrice = item.selectedVariant?.price ?? item.product.price;
  const itemImage = item.selectedVariant?.images?.[0] ?? item.product.image;

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md border border-slate-200/80">
      <Checkbox
        className="mt-1 flex-shrink-0"
        checked={item.selected}
        onCheckedChange={() => onToggleSelect(item.cartItemId)}
        aria-label={`Select ${
          item.product.name[locale] || item.product.name.ar || "product"
        }`}
      />
      <Image
        src={itemImage}
        alt={
          item.product.name[locale] || item.product.name.ar || "Product image"
        }
        width={80}
        height={80}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-base text-slate-800">
            {item.product.name[locale] || item.product.name.ar || "Product"}
          </h3>
          <button
            onClick={() => onRemove(item.cartItemId)}
            className="p-1 text-slate-400 hover:text-red-600 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
          {/* --- Variant & Quantity Group --- */}
          <div className="flex items-center gap-4">
            {/* Variant Display */}
            {item.selectedVariant && (
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {Object.entries(item.selectedVariant.options).map(
                  ([optionKey, optionValue]) => {
                    const variantOption = item.product.variantOptions?.find(
                      (opt) =>
                        opt.name.fr === optionKey || opt.name.ar === optionKey
                    );
                    const displayName = variantOption
                      ? variantOption.name[locale]
                      : optionKey;
                    const isColorOption =
                      displayName.toLowerCase() === "couleur" ||
                      displayName.toLowerCase() === "اللون";
                    return (
                      <span
                        key={optionKey}
                        className="text-sm text-slate-500 flex items-center gap-1"
                      >
                        {displayName}:
                        {isColorOption ? (
                          <span
                            className="inline-block w-4 h-4 rounded-full border border-slate-300"
                            style={{
                              backgroundColor: optionValue,
                            }}
                            title={optionValue}
                          />
                        ) : (
                          <span className="font-medium text-slate-600">
                            {optionValue}
                          </span>
                        )}
                      </span>
                    );
                  }
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-200 rounded-md">
              <button
                onClick={() =>
                  onUpdateQuantity(item.cartItemId, item.quantity - 1)
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
                  onUpdateQuantity(item.cartItemId, item.quantity + 1)
                }
                className="p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Item Total Price */}
          <p className="mt-2 sm:mt-0 font-bold text-slate-800 text-base text-right">
            {(itemPrice * item.quantity).toFixed(2)} {currency}
          </p>
        </div>
      </div>
    </div>
  );
}
