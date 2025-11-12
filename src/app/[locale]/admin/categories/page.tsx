"use client";

import { Category, Language } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTranslations, useLocale } from "next-intl";
import CategoriesHeader from "./components/CategoriesHeader";
import CategoriesTable from "./components/CategoriesTable";
import CategoriesPagination from "./components/CategoriesPagination";
import CategoryFormModal from "./components/CategoryFormModal";

const CategoriesPage: React.FC = () => {
  const t = useTranslations("admin.categories");
  const locale = useLocale() as Language;

  // 1. Zustand Store Integration
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  // 2. State for UI and Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 3. Fetch initial data
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 4. Local filtering and pagination
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const lowercasedFilter = searchTerm.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.ar.toLowerCase().includes(lowercasedFilter) ||
        cat.name.fr.toLowerCase().includes(lowercasedFilter)
    );
  }, [categories, searchTerm]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    return filteredCategories.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredCategories, currentPage, itemsPerPage]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to submit category form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm(t("deleteDialog.description"))) {
      try {
        await deleteCategory(categoryId);
      } catch (err) {
        console.error("Failed to delete category:", err);
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
      <CategoriesHeader
        t={t}
        categoriesCount={categories.length}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddClick={handleOpenAddModal}
      />

      <CategoriesTable
        t={t}
        locale={locale}
        categories={paginatedCategories}
        isLoading={isLoading && categories.length === 0}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <CategoriesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isModalOpen && (
        <CategoryFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          category={editingCategory}
          lang={locale}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
