"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Product, Category, Locale } from "@/types";
import ProductCard from "@/components/ProductCard";
import {
  Search,
  ChevronDown,
  Loader2,
  AlertCircle,
  Filter,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

// --- Modern Pagination Component ---
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const t = useTranslations("pagination");

  const getPaginationRange = () => {
    const totalNumbers = 5; // Total page numbers to show
    const totalBlocks = totalNumbers + 2; // totalNumbers + 2 for ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPages = [1, 2];
    const endPages = [totalPages - 1, totalPages];
    const siblingStart = Math.max(
      Math.min(currentPage - 1, totalPages - totalNumbers + 1),
      3
    );
    const siblingEnd = Math.min(
      siblingStart + totalNumbers - 3,
      totalPages - 2
    );

    let pages: (number | string)[] = [...startPages];

    if (siblingStart > 3) {
      pages.push("...");
    }

    for (let i = siblingStart; i <= siblingEnd; i++) {
      pages.push(i);
    }

    if (siblingEnd < totalPages - 2) {
      pages.push("...");
    }

    pages.push(...endPages);

    // Remove duplicates that might occur in edge cases
    return [...new Set(pages)];
  };

  const pageNumbers = getPaginationRange();

  return (
    <nav
      className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12"
      aria-label="Pagination"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-neutral-700 hover:bg-primary-50 border border-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t("previous")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {pageNumbers.map((page, index) =>
            typeof page === "string" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center h-10 w-10 text-neutral-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white text-neutral-700 hover:bg-primary-50 border border-neutral-300"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-neutral-700 hover:bg-primary-50 border border-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t("next")}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

// --- Reusable Custom Select Component ---
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-56 text-left bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={`h-5 w-5 text-neutral-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <ul
          className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-lg border border-neutral-200 max-h-60 overflow-auto focus:outline-none"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className="flex items-center justify-between text-sm text-neutral-800 px-4 py-2.5 cursor-pointer hover:bg-primary-50"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option.value}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check className="h-4 w-4 text-primary-600" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- Reusable Filter Section Component ---
const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="py-6 border-b border-neutral-200 last:border-b-0">
    <h3 className="text-base font-semibold text-neutral-800 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

// --- Standalone FilterSidebar Component ---
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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategories,
  handleCategoryChange,
  priceRange,
  setPriceRange,
  maxPrice,
  locale,
}) => {
  const t = useTranslations("products");

  return (
    <aside className="flex flex-col">
      <FilterSection title={t("search")}>
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
      </FilterSection>

      <FilterSection title={t("categories")}>
        {categories.map((cat) => (
          <label
            key={cat.id}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.id)}
              onChange={() => handleCategoryChange(cat.id)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700 group-hover:text-primary-600">
              {cat.name[locale]}
            </span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title={t("priceRange")}>
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
      </FilterSection>
    </aside>
  );
};

export default function ProductsPage() {
  const t = useTranslations("products");
  const locale = useLocale() as Locale;

  // Data states
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        if (!productsRes.ok || !categoriesRes.ok)
          throw new Error(t("fetchError"));

        const productsData: Product[] = await productsRes.json();
        const categoriesData: Category[] = await categoriesRes.json();

        setAllProducts(productsData);
        setCategories(categoriesData);

        const calculatedMaxPrice = Math.ceil(
          productsData.reduce((max, p) => (p.price > max ? p.price : max), 0)
        );
        setMaxPrice(calculatedMaxPrice > 0 ? calculatedMaxPrice : 1000);
        setPriceRange([0, calculatedMaxPrice > 0 ? calculatedMaxPrice : 1000]);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : t("fetchError"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Memoized filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];
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
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
    return filtered;
  }, [
    allProducts,
    selectedCategories,
    searchQuery,
    priceRange,
    sortOption,
    locale,
  ]);

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

  const sortOptions = [
    { value: "default", label: t("sortBy.default") },
    { value: "newest", label: t("sortBy.newest") },
    { value: "price-asc", label: t("sortBy.priceAsc") },
    { value: "price-desc", label: t("sortBy.priceDesc") },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center text-red-600 bg-red-50 p-8 rounded-lg">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("errorTitle")}</h2>
        <p>{error}</p>
      </div>
    );

  const sidebarProps = {
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
    <div className="bg-neutral-50/70">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* --- Mobile Filter --- */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFilterSidebarOpen(true)}
              className="flex items-center gap-2 w-full justify-center py-3 bg-white border border-neutral-300 rounded-lg font-semibold text-neutral-700 shadow-sm"
            >
              <Filter className="w-5 h-5" />
              {t("filters")}
            </button>
          </div>
          {isFilterSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setIsFilterSidebarOpen(false)}
            ></div>
          )}
          <div
            className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform ${
              isFilterSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden overflow-y-auto shadow-2xl`}
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{t("filters")}</h2>
              <button onClick={() => setIsFilterSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar {...sidebarProps} />
            </div>
          </div>

          {/* --- Desktop Sidebar --- */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-neutral-200/80 h-fit sticky top-24">
            <FilterSidebar {...sidebarProps} />
          </div>

          {/* --- Main Content --- */}
          <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-neutral-200/80">
              <p className="text-neutral-600 text-sm mb-3 sm:mb-0">
                {t("showingResults", {
                  count: filteredAndSortedProducts.length,
                })}
              </p>
              <CustomSelect
                options={sortOptions}
                value={sortOption}
                onChange={setSortOption}
                placeholder={t("sortBy.default")}
              />
            </div>

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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-neutral-200/80">
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
    </div>
  );
}
