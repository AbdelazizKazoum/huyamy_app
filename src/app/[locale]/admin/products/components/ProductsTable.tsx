"use client";

import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ui/ActionButtons";
import { Language, Product } from "@/types";
import Image from "next/image";

interface ProductsTableProps {
  t: (key: string, values?: Record<string, string | number>) => string;
  locale: Language;
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductsTable({
  t,
  locale,
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const columns: {
    key: keyof Product;
    label: string;
    sortable: boolean;
    render?: (item: Product) => React.ReactNode;
    mobileLabel?: string;
    hiddenOnMobile?: boolean;
  }[] = [
    {
      key: "name",
      label: t("table.product"),
      mobileLabel: t("table.product"),
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Image
            src={item.image}
            alt={item.name[locale]}
            width={48}
            height={48}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-md object-cover bg-gray-100 flex-shrink-0"
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
      key: "category",
      label: t("table.category"),
      mobileLabel: t("table.category"),
      sortable: true,
      render: (item) => (
        <span
          className="text-sm sm:text-base text-gray-600 truncate block max-w-[100px] sm:max-w-[150px]"
          title={item.category.name[locale]}
        >
          {item.category.name[locale]}
        </span>
      ),
    },
    {
      key: "price",
      label: t("table.price"),
      mobileLabel: t("table.price"),
      sortable: true,
      render: (item) => (
        <span className="font-mono text-sm sm:text-base font-semibold text-green-600">
          {item.price.toFixed(2)} {locale === "ar" ? "د.م." : "MAD"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={products}
      isLoading={isLoading}
      itemsPerPage={8}
      emptyMessage={t("emptyMessage")}
      renderActions={(item: Product) => (
        <ActionButtons
          t={t}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          getId={(item) => item.id}
        />
      )}
    />
  );
}
