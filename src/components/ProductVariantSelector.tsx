"use client";

import { Language, Product } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { Check } from "lucide-react";

interface ProductVariantSelectorProps {
  product: Product;
  selectedOptions: { [key: string]: string };
  setSelectedOptions: Dispatch<SetStateAction<{ [key: string]: string }>>;
  lang: Language;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  product,
  selectedOptions,
  setSelectedOptions,
  lang,
}) => {
  if (!product.variantOptions || product.variantOptions.length === 0) {
    return null;
  }

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  return (
    <div className="space-y-5 pt-4">
      {product.variantOptions.map((option) => {
        const isColorOption = option.name.fr.toLowerCase() === "couleur";

        return (
          <div
            key={option.name.fr}
            className="p-4 rounded-lg bg-slate-50/70 border border-slate-200"
          >
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              {option.name[lang]} :
              <span className="ms-2 font-normal text-primary-800">
                {selectedOptions[option.name.fr]}
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => {
                const isActive = selectedOptions[option.name.fr] === value;

                return isColorOption ? (
                  <button
                    key={value}
                    onClick={() => handleOptionSelect(option.name.fr, value)}
                    aria-label={value}
                    title={value}
                    style={{ backgroundColor: value }}
                    // --- MODIFIED: Added flex utilities to center the checkmark ---
                    className={` cursor-pointer relative w-8 h-8 rounded-full border border-black/10 transition-all duration-200
                                flex items-center justify-center
                                focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 ${
                                  isActive
                                    ? // Keep the ring to show selection
                                      "ring-1 ring-offset-2 ring-primary-600 shadow-md"
                                    : "hover:ring-1 hover:ring-offset-slate-50 hover:ring-gray-400"
                                }`}
                    // --- END MODIFIED ---
                  >
                    {/* --- MODIFIED: Replaced badge with an internal overlay and checkmark --- */}
                    {isActive && (
                      // This overlay ensures the checkmark is visible on *any* color
                      <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
                        <Check
                          size={16}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                    {/* --- END MODIFIED --- */}
                  </button>
                ) : (
                  <button
                    key={value}
                    onClick={() => handleOptionSelect(option.name.fr, value)}
                    className={`relative flex items-center justify-center px-5 py-2.5 text-base font-medium border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      isActive
                        ? "bg-primary-50 border-primary-600 text-primary-900 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {value}
                    {/* This checkmark badge remains for non-color options */}
                    {isActive && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 text-white">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductVariantSelector;
