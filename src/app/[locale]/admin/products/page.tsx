"use client";

import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/ui/SearchInput";
import ActionButtons from "@/components/admin/ui/ActionButtons";
import { Category, Language, Product } from "@/types";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import ProductFormModal from "@/components/admin/modals/ProductFormModal";
import { useProductStore } from "@/store/useProductStore";
import { fetchAllCategoriesAPI } from "@/lib/api/categories";
import { useTranslations, useLocale } from "next-intl";

const ProductsPage: React.FC = () => {
  const t = useTranslations("admin.products");
  const locale = useLocale() as Language;

  // Zustand store integration
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  // Fetch initial data from Firebase via the store
  useEffect(() => {
    fetchProducts();
    fetchAllCategoriesAPI().then(setCategories);
  }, [fetchProducts]);

  // Local filtering based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowercasedFilter = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.ar.toLowerCase().includes(lowercasedFilter) ||
        product.name.fr.toLowerCase().includes(lowercasedFilter) ||
        product.category.name.ar.toLowerCase().includes(lowercasedFilter) ||
        product.category.name.fr.toLowerCase().includes(lowercasedFilter)
    );
  }, [products, searchTerm]);

  // Local pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to submit form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm(t("deleteDialog.description"))) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
  };

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

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 px-4">
        {t("errorLoading", { error })}
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 self-start md:self-center">
          {t("title")} ({products.length})
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t("searchPlaceholder")}
            // className="w-full md:w-auto"
          />
          <button
            onClick={handleOpenAddModal}
            className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center text-sm sm:text-base"
          >
            <PlusCircle size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{t("addProduct")}</span>
            <span className="sm:hidden">{t("addProduct")}</span>
          </button>
        </div>
      </div>

      {/* DataTable with built-in mobile cards */}
      <DataTable
        columns={columns}
        data={paginatedProducts}
        isLoading={isLoading && products.length === 0}
        itemsPerPage={itemsPerPage}
        emptyMessage={t("emptyMessage")}
        renderActions={(item: Product) => (
          <ActionButtons
            t={t}
            item={item}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            getId={(item) => item.id}
          />
        )}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          product={editingProduct}
          categories={categories}
          lang={locale}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ProductsPage;
