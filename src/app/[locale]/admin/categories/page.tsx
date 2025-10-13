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

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3 mb-6">
        {paginatedCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start gap-3">
              <Image
                src={category.image}
                alt={category.name[lang]}
                width={60}
                height={60}
                className="w-15 h-15 rounded-full object-cover bg-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 text-base mb-1 truncate">
                  {category.name[lang]}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {category.description[lang]}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(category)}
                    className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md text-sm transition-colors"
                  >
                    <Edit size={14} />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md text-sm transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && categories.length === 0 && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-15 h-15 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-7 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-7 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {paginatedCategories.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "لا توجد فئات مطابقة للبحث" : "لا توجد فئات"}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={paginatedCategories}
            isLoading={isLoading && categories.length === 0}
            itemsPerPage={itemsPerPage}
            renderActions={(item: Category) => (
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="تعديل"
                >
                  <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="حذف"
                >
                  <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            )}
            emptyMessage="لا توجد فئات"
          />
        </div>
      </div>

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
