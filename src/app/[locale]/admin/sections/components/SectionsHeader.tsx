"use client";

import { PlusCircle } from "lucide-react";

interface SectionsHeaderProps {
  t: (key: string) => string;
  sectionsCount: number;
  onAddClick: () => void;
}

export default function SectionsHeader({
  t,
  sectionsCount,
  onAddClick,
}: SectionsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 self-start md:self-center">
        {t("title")} ({sectionsCount})
      </h1>
      <button
        onClick={onAddClick}
        className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center text-sm sm:text-base"
      >
        <PlusCircle size={18} className="sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">{t("addSection")}</span>
        <span className="sm:hidden">{t("add")}</span>
      </button>
    </div>
  );
}
