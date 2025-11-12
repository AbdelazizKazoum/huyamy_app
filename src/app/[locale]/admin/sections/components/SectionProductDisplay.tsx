"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Product } from "@/types/product";
import { Language } from "@/types";
import FormInput from "@/components/admin/ui/FormInput";

interface SectionProductDisplayProps {
  products: Product[];
  selectedProductIds: string[];
  onProductSelectionChange: (productId: string, checked: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  lang: Language;
}

const SectionProductDisplay: React.FC<SectionProductDisplayProps> = ({
  products,
  selectedProductIds,
  onProductSelectionChange,
  searchTerm,
  onSearchTermChange,
  lang,
}) => {
  const t = useTranslations("admin.sections.modal");

  const filteredProducts = products.filter((product) =>
    product.name[lang].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <FormInput
        label={t("labels.searchProducts")}
        id="searchProducts"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        placeholder={t("placeholders.searchProducts")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
          >
            <input
              type="checkbox"
              id={`product-${product.id}`}
              checked={selectedProductIds.includes(product.id)}
              onChange={(e) =>
                onProductSelectionChange(product.id, e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`product-${product.id}`}
              className="flex-1 text-sm font-medium text-gray-900 cursor-pointer"
            >
              {product.name[lang]}
            </label>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          {t("messages.noProductsFound")}
        </p>
      )}
    </div>
  );
};

export default SectionProductDisplay;
