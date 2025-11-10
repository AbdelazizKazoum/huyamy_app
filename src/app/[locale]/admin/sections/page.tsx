"use client";

import { useEffect, useState } from "react";
import { Language, Section, SectionWithProducts } from "@/types";
import { useSectionStore } from "@/store/useSectionStore";
import DataTable from "@/components/admin/DataTable";
import SectionFormModal from "@/components/admin/modals/SectionFormModal";
import { Edit, PlusCircle, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const SectionsPage: React.FC = () => {
  const t = useTranslations("admin.sections");
  const locale = useLocale() as Language;

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
    if (window.confirm(t("deleteDialog.description"))) {
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
          {t("productCount", {
            count:
              item.products?.length || item.data.ctaProductIds?.length || 0,
          })}
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
    <div className="px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 self-start md:self-center">
          {t("title")} ({sections.length})
        </h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center text-sm sm:text-base"
        >
          <PlusCircle size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t("addSection")}</span>
          <span className="sm:hidden">{t("add")}</span>
        </button>
      </div>

      {/* DataTable with built-in mobile cards */}
      <DataTable
        columns={columns}
        data={sections}
        isLoading={isLoading && sections.length === 0}
        itemsPerPage={10}
        emptyMessage={t("emptyMessage")}
        renderActions={(item: Section) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleOpenEditModal(item)}
              className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors justify-center"
              title={t("actions.edit")}
            >
              <Edit size={14} />
              <span>{t("actions.edit")}</span>
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm transition-colors justify-center"
              title={t("actions.delete")}
            >
              <Trash2 size={14} />
              <span>{t("actions.delete")}</span>
            </button>
          </div>
        )}
      />

      {/* Modal */}
      {isModalOpen && (
        <SectionFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          section={editingSection}
          lang={locale}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default SectionsPage;
