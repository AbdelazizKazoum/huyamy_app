"use client";

import ProductsHeader from "./components/ProductsHeader";
import ProductsTable from "./components/ProductsTable";
import ProductsPagination from "./components/ProductsPagination";
import ProductFormModal from "./components/ProductFormModal";
import { Category, Language, Product } from "@/types";
import { useMemo, useState, useEffect } from "react";
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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 px-4">
        {t("errorLoading", { error })}
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      <ProductsHeader
        t={t}
        productsCount={products.length}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddClick={handleOpenAddModal}
      />

      <ProductsTable
        t={t}
        locale={locale}
        products={paginatedProducts}
        isLoading={isLoading && products.length === 0}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <ProductsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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
