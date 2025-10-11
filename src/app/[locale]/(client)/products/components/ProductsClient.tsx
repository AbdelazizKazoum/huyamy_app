"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Product, Category, Locale } from "@/types";
import ProductCard from "@/components/ProductCard";
import { AlertCircle } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import ProductsHeader from "./ProductsHeader";
import ProductsPagination from "./ProductsPagination";
import MobileFilterOverlay from "./MobileFilterOverlay";

const PRODUCTS_PER_PAGE = 12;

interface ProductsClientProps {
  initialData: {
    products: Product[];
    categories: Category[];
    maxPrice: number;
  };
  locale: Locale;
}

export default function ProductsClient({
  initialData,
  locale,
}: ProductsClientProps) {
  const t = useTranslations("products");
  const { products, categories, maxPrice } = initialData;

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Memoized filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.categoryId)
      );
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name[locale]?.toLowerCase().includes(lowerQuery) ||
          p.description?.[locale]?.toLowerCase().includes(lowerQuery)
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        );
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategories,
    searchQuery,
    priceRange,
    sortOption,
    locale,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, priceRange, sortOption]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterProps = {
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategories,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    maxPrice,
    locale,
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Mobile Filter Trigger */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsFilterSidebarOpen(true)}
            className="flex items-center gap-2 w-full justify-center py-3 bg-white border border-neutral-300 rounded-lg font-semibold text-neutral-700 shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              />
            </svg>
            {t("filters")}
          </button>
        </div>

        {/* Mobile Filter Overlay */}
        <MobileFilterOverlay
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
          filterProps={filterProps}
        />

        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-neutral-200/80 h-fit sticky top-24">
          <FilterSidebar {...filterProps} />
        </div>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <ProductsHeader
            resultCount={filteredAndSortedProducts.length}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />

          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lang={locale}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <ProductsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-neutral-200/80">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <h2 className="text-2xl font-semibold text-neutral-700">
                {t("noResults.title")}
              </h2>
              <p className="text-neutral-500 mt-2">
                {t("noResults.description")}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
