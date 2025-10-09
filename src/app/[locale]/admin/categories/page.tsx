"use client";
import DataTable from "@/components/admin/DataTable";
import CategoryFormModal from "@/components/admin/modals/CategoryFormModal";
import { Category, Language } from "@/types";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCategoryStore } from "@/store/useCategoryStore";
import SearchInput from "@/components/admin/ui/SearchInput";
import Pagination from "@/components/admin/Pagination";

const CategoriesPage: React.FC = () => {
  const lang = "ar" as Language;

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

  // 5. Modal and Form Handlers
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
        // Optionally show success toast
      } else {
        await addCategory(formData);
        // Optionally show success toast
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to submit category form:", err);
      // Optionally show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذه الفئة؟")) {
      try {
        await deleteCategory(categoryId);
        // Optionally show success toast
      } catch (err) {
        console.error("Failed to delete category:", err);
        // Optionally show error toast
      }
    }
  };

  const columns: {
    key: keyof Category;
    label: string;
    sortable: boolean;
    render?: (item: Category) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "الفئة",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-4">
          <Image
            src={item.image}
            alt={item.name[lang]}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover bg-gray-100"
          />
          <span className="font-medium text-gray-800">{item.name[lang]}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "الوصف",
      sortable: true,
      render: (item) => (
        <span className="max-w-sm truncate block">
          {item.description[lang]}
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load categories: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 self-start md:self-center">
          إدارة الفئات ({categories.length})
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="...ابحث عن فئة"
          />
          <button
            onClick={handleOpenAddModal}
            className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">فئة جديدة</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={paginatedCategories}
        isLoading={isLoading && categories.length === 0}
        itemsPerPage={itemsPerPage}
        renderActions={(item: Category) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenEditModal(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {isModalOpen && (
        <CategoryFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          category={editingCategory}
          lang={lang}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
