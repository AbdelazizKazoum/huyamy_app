"use client";

import { PlusCircle } from "lucide-react";
import SearchInput from "@/components/admin/ui/SearchInput";

interface ProductsHeaderProps {
  t: (key: string, values?: Record<string, string | number>) => string;
  productsCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export default function ProductsHeader({
  t,
  productsCount,
  searchTerm,
  onSearchChange,
  onAddClick,
}: ProductsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 self-start md:self-center">
        {t("title")} ({productsCount})
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <SearchInput
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
        />
        <button
          onClick={onAddClick}
          className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center text-sm sm:text-base"
        >
          <PlusCircle size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t("addProduct")}</span>
          <span className="sm:hidden">{t("addProduct")}</span>
        </button>
      </div>
    </div>
  );
}
