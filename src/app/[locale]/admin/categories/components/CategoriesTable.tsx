"use client";

import DataTable from "@/components/admin/DataTable";
import { Category, Language } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

interface CategoriesTableProps {
  t: (key: string, values?: Record<string, string | number>) => string;
  locale: Language;
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export default function CategoriesTable({
  t,
  locale,
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const columns: {
    key: keyof Category;
    label: string;
    sortable: boolean;
    render?: (item: Category) => React.ReactNode;
    mobileLabel?: string;
    hiddenOnMobile?: boolean;
  }[] = [
    {
      key: "name",
      label: t("table.category"),
      mobileLabel: t("table.category"),
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Image
            src={item.image}
            alt={item.name[locale]}
            width={48}
            height={48}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover bg-gray-100 flex-shrink-0"
          />
          <span
            className="font-medium text-gray-800 text-sm sm:text-base truncate min-w-0"
            title={item.name[locale]}
          >
            {item.name[locale]}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      label: t("table.description"),
      mobileLabel: t("table.description"),
      sortable: true,
      render: (item) => (
        <div className="min-w-0 max-w-[150px] sm:max-w-[300px]">
          <span
            className="text-sm sm:text-base text-gray-600 block truncate"
            title={item.description[locale]}
          >
            {item.description[locale]}
          </span>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={categories}
      isLoading={isLoading}
      itemsPerPage={8}
      emptyMessage={t("emptyMessage")}
      renderActions={(item: Category) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors justify-center"
            title={t("actions.edit")}
          >
            <Edit size={14} />
            <span>{t("actions.edit")}</span>
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm transition-colors justify-center"
            title={t("actions.delete")}
          >
            <Trash2 size={14} />
            <span>{t("actions.delete")}</span>
          </button>
        </div>
      )}
    />
  );
}
