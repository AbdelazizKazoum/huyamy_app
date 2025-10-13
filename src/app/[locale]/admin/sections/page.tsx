"use client";

import { useEffect, useState } from "react";
import { Language, Section, SectionWithProducts } from "@/types";
import { useSectionStore } from "@/store/useSectionStore";
import DataTable from "@/components/admin/DataTable";
import SectionFormModal from "@/components/admin/modals/SectionFormModal";
import { Edit, PlusCircle, Trash2, CheckCircle, XCircle } from "lucide-react";

const SectionsPage: React.FC = () => {
  const lang = "ar" as Language;

  // Zustand Store Integration
  const {
    sections,
    isLoading,
    fetchSections,
    addSection,
    updateSection,
    deleteSection,
  } = useSectionStore();

  // State for UI and Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data from stores
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Modal and Form Handlers
  const handleOpenAddModal = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (section: Section) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingSection) {
        await updateSection(editingSection.id, formData);
      } else {
        await addSection(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to submit section form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (sectionId: string) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا القسم؟")) {
      await deleteSection(sectionId);
    }
  };

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
      label: "النوع",
      mobileLabel: "النوع",
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
      label: "العنوان",
      mobileLabel: "العنوان",
      sortable: true,
      render: (item: SectionWithProducts) => (
        <span
          className="text-sm sm:text-base truncate block max-w-[120px] sm:max-w-[200px]"
          title={item.data.title?.[lang] || "N/A"}
        >
          {item.data.title?.[lang] || "N/A"}
        </span>
      ),
    },
    {
      key: "products",
      label: "المنتجات",
      mobileLabel: "عدد المنتجات",
      sortable: false,
      render: (item: SectionWithProducts) => (
        <span className="text-sm sm:text-base">
          {item.products?.length || item.data.ctaProductIds?.length || 0} منتج
        </span>
      ),
    },
    {
      key: "isActive",
      label: "فعال",
      mobileLabel: "الحالة",
      sortable: true,
      render: (item: SectionWithProducts) => (
        <div className="flex items-center gap-1">
          {item.isActive ? (
            <>
              <CheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm text-green-600">فعال</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm text-red-600">غير فعال</span>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 self-start md:self-center">
          إدارة الأقسام ({sections.length})
        </h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center text-sm sm:text-base"
        >
          <PlusCircle size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">قسم جديد</span>
          <span className="sm:hidden">إضافة</span>
        </button>
      </div>

      {/* DataTable with built-in mobile cards */}
      <DataTable
        columns={columns}
        data={sections}
        isLoading={isLoading && sections.length === 0}
        itemsPerPage={10}
        emptyMessage="لا توجد أقسام"
        renderActions={(item: Section) => (
          <>
            <button
              onClick={() => handleOpenEditModal(item)}
              className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors flex-1 justify-center"
            >
              <Edit size={14} />
              <span>تعديل</span>
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm transition-colors flex-1 justify-center"
            >
              <Trash2 size={14} />
              <span>حذف</span>
            </button>
          </>
        )}
      />

      {/* Modal */}
      {isModalOpen && (
        <SectionFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          section={editingSection}
          lang={lang}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default SectionsPage;
