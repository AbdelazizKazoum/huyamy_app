"use client";

import { useTranslations } from "next-intl";
import { Category, Locale } from "@/types";
import { Search } from "lucide-react";

interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryChange: (id: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  locale: Locale;
  isCategoryPage: boolean;
}

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="py-6 border-b border-neutral-200 last:border-b-0">
    <h3 className="text-base font-semibold text-neutral-800 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

export default function FilterSidebar({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategories,
  handleCategoryChange,
  priceRange,
  setPriceRange,
  maxPrice,
  locale,
  isCategoryPage,
}: FilterSidebarProps) {
  const t = useTranslations("products");

  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-neutral-800">
          {t("search")}
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </div>
      </div>

      {/* Categories Filter */}
      {!isCategoryPage && categories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-neutral-800">
            {t("categories")}
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700 group-hover:text-primary-600">
                  {category.name[locale]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-neutral-800">
          {t("priceRange")}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-3 flex items-center text-sm text-neutral-500">
              د.م.
            </span>
            <input
              type="number"
              min={0}
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-full p-2 pl-12 border border-neutral-300 rounded-md text-center"
              aria-label="Minimum price"
            />
          </div>
          <span className="text-neutral-400">-</span>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-3 flex items-center text-sm text-neutral-500">
              د.م.
            </span>
            <input
              type="number"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-full p-2 pl-12 border border-neutral-300 rounded-md text-center"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
