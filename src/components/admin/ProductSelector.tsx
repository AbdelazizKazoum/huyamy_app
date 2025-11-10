"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Product, Language } from "@/types";
import { Search } from "lucide-react";
import Image from "next/image";
import { useProductStore } from "@/store/useProductStore";
import { useTranslations, useLocale } from "next-intl";

interface ProductSelectorProps {
  availableProducts: Product[]; // Passed as prop; if empty, no products shown
  onProductSelect: (product: Product) => void; // Accepts full Product object
  lang: Language;
  label: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  availableProducts,
  onProductSelect,
  lang,
  label,
}) => {
  const t = useTranslations("admin.productSelector");
  const locale = useLocale() as Language;

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Local loading state for fetching
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch products from store if not already loaded (for fallback, but we won't use it)
  const { products, fetchProducts } = useProductStore();
  useEffect(() => {
    if (products.length === 0) {
      setIsLoading(true);
      fetchProducts().finally(() => setIsLoading(false));
    }
  }, [products.length, fetchProducts]);

  // Use availableProducts prop; if empty, show no products
  const productsToFilter = availableProducts;

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return productsToFilter;
    return productsToFilter.filter(
      (p) =>
        p.name.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.fr.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, productsToFilter]);

  const handleSelect = (product: Product) => {
    onProductSelect(product); // Pass full product object
    setSearchTerm("");
    setIsOpen(false);
  };

  // Effect to handle clicks outside the component to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {isOpen && (isLoading || filteredProducts.length > 0) && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              // Skeleton loaders for better UX during fetching
              <ul className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-4 p-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </li>
                ))}
              </ul>
            ) : (
              // Actual product list
              <ul className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="flex items-center gap-4 p-3 cursor-pointer hover:bg-green-50"
                  >
                    <Image
                      src={product.image}
                      alt={product.name[lang]}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-md bg-gray-100"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {product.name[lang]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSelector;
