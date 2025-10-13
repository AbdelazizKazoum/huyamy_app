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
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذه الفئة؟")) {
      try {
        await deleteCategory(categoryId);
      } catch (err) {
        console.error("Failed to delete category:", err);
      }
    }
  };

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
      label: "الفئة",
      mobileLabel: "اسم الفئة",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Image
            src={item.image}
            alt={item.name[lang]}
            width={48}
            height={48}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover bg-gray-100 flex-shrink-0"
          />
          <span
            className="font-medium text-gray-800 text-sm sm:text-base truncate min-w-0"
            title={item.name[lang]}
          >
            {item.name[lang]}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      label: "الوصف",
      mobileLabel: "الوصف",
      sortable: true,
      render: (item) => (
        <div className="min-w-0 max-w-[150px] sm:max-w-[300px]">
          <span
            className="text-sm sm:text-base text-gray-600 block truncate"
            title={item.description[lang]}
          >
            {item.description[lang]}
          </span>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 px-4">
        Failed to load categories: {error}
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 self-start md:self-center">
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
            // className="w-full md:w-auto"
          />
          <button
            onClick={handleOpenAddModal}
            className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center text-sm sm:text-base"
          >
            <PlusCircle size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">فئة جديدة</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
      </div>

      {/* DataTable with built-in mobile cards */}
      <DataTable
        columns={columns}
        data={paginatedCategories}
        isLoading={isLoading && categories.length === 0}
        itemsPerPage={itemsPerPage}
        emptyMessage="لا توجد فئات"
        renderActions={(item: Category) => (
          <>
            <button
              onClick={() => handleOpenEditModal(item)}
              className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors flex-1 justify-center"
              title="تعديل"
            >
              <Edit size={14} />
              <span>تعديل</span>
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm transition-colors flex-1 justify-center"
              title="حذف"
            >
              <Trash2 size={14} />
              <span>حذف</span>
            </button>
          </>
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
