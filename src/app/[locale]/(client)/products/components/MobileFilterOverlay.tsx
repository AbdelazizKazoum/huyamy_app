"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import FilterSidebar from "./FilterSidebar";
import { Category, Locale } from "@/types";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryChange: (id: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  locale: Locale;
}

interface MobileFilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filterProps: FilterProps;
}

export default function MobileFilterOverlay({
  isOpen,
  onClose,
  filterProps,
}: MobileFilterOverlayProps) {
  const t = useTranslations("products");

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay */}
      <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-xl lg:hidden">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-800">
              {t("filters")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-md hover:bg-neutral-100 transition-colors"
              aria-label="Close filters"
            >
              <X className="h-5 w-5 text-neutral-500" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <FilterSidebar {...filterProps} />
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {t("applyFilters")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
