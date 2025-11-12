"use client";

import DataTable from "@/components/admin/DataTable";
import { Section, SectionWithProducts, Language } from "@/types";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

interface SectionsTableProps {
  t: (key: string) => string;
  locale: Language;
  sections: SectionWithProducts[];
  isLoading: boolean;
  onEdit: (section: Section) => void;
  onDelete: (sectionId: string) => void;
}

export default function SectionsTable({
  t,
  locale,
  sections,
  isLoading,
  onEdit,
  onDelete,
}: SectionsTableProps) {
  const columns: {
    key: keyof SectionWithProducts;
    label: string;
    sortable: boolean;
    render?: (item: SectionWithProducts) => React.ReactNode;
    mobileLabel?: string;
    hiddenOnMobile?: boolean;
  }[] = [
    {
      key: "type",
      label: t("table.type"),
      mobileLabel: t("table.type"),
      sortable: true,
      render: (item: SectionWithProducts) => (
        <span
          className="text-sm sm:text-base truncate block max-w-[100px] sm:max-w-[150px]"
          title={item.type}
        >
          {item.type}
        </span>
      ),
    },
    {
      key: "data",
      label: t("table.title"),
      mobileLabel: t("table.title"),
      sortable: true,
      render: (item: SectionWithProducts) => (
        <span
          className="text-sm sm:text-base truncate block max-w-[120px] sm:max-w-[200px]"
          title={item.data.title?.[locale] || "N/A"}
        >
          {item.data.title?.[locale] || "N/A"}
        </span>
      ),
    },
    {
      key: "products",
      label: t("table.products"),
      mobileLabel: t("table.products"),
      sortable: false,
      render: (item: SectionWithProducts) => (
        <span className="text-sm sm:text-base">
          {item.products?.length || item.data.ctaProductIds?.length || 0} {t("products")}
        </span>
      ),
    },
    {
      key: "isActive",
      label: t("table.status"),
      mobileLabel: t("table.status"),
      sortable: true,
      render: (item: SectionWithProducts) => (
        <div className="flex items-center gap-1">
          {item.isActive ? (
            <>
              <CheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm text-green-600">
                {t("status.active")}
              </span>
            </>
          ) : (
            <>
              <XCircle className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm text-red-600">
                {t("status.inactive")}
              </span>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={sections}
      isLoading={isLoading}
      itemsPerPage={10}
      emptyMessage={t("emptyMessage")}
      renderActions={(item: Section) => (
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