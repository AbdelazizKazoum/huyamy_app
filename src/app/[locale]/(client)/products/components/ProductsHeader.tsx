"use client";

import { useTranslations } from "next-intl";
import CustomSelect from "./CustomSelect";

interface ProductsHeaderProps {
  resultCount: number;
  sortOption: string;
  setSortOption: (option: string) => void;
}

export default function ProductsHeader({
  resultCount,
  sortOption,
  setSortOption,
}: ProductsHeaderProps) {
  const t = useTranslations("products");

  const sortOptions = [
    { value: "default", label: t("sortBy.default") },
    { value: "newest", label: t("sortBy.newest") },
    { value: "price-asc", label: t("sortBy.priceAsc") },
    { value: "price-desc", label: t("sortBy.priceDesc") },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-neutral-200/80">
      <p className="text-neutral-600 text-sm mb-3 sm:mb-0">
        {t("showingResults", { count: resultCount })}
      </p>
      <CustomSelect
        options={sortOptions}
        value={sortOption}
        onChange={setSortOption}
        placeholder={t("sortBy.default")}
      />
    </div>
  );
}
