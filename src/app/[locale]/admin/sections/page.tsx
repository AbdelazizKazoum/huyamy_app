"use client";

import { useEffect, useState } from "react";
import { Language, Section } from "@/types";
import { useSectionStore } from "@/store/useSectionStore";
import { useTranslations, useLocale } from "next-intl";
import SectionsHeader from "./components/SectionsHeader";
import SectionsTable from "./components/SectionsTable";
import SectionFormModal from "./components/SectionFormModal";

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

  return (
    <div className="px-2 sm:px-0">
      <SectionsHeader
        t={t}
        sectionsCount={sections.length}
        onAddClick={handleOpenAddModal}
      />

      <SectionsTable
        t={t}
        locale={locale}
        sections={sections}
        isLoading={isLoading && sections.length === 0}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

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
