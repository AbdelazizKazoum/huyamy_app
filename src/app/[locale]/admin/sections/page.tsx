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
  }[] = [
    { key: "type", label: "النوع", sortable: true },
    {
      key: "data",
      label: "العنوان",
      sortable: true,
      render: (item: SectionWithProducts) => item.data.title?.[lang] || "N/A",
    },
    {
      key: "products",
      label: "المنتجات",
      sortable: false,
      render: (item: SectionWithProducts) =>
        item.products?.length || item.data.ctaProductIds?.length || 0,
    },
    {
      key: "isActive",
      label: "فعال",
      sortable: true,
      render: (item: SectionWithProducts) =>
        item.isActive ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          إدارة الأقسام ({sections.length})
        </h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800"
        >
          <PlusCircle size={20} />
          <span>قسم جديد</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={sections}
        isLoading={isLoading}
        itemsPerPage={10}
        renderActions={(item: Section) => (
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
