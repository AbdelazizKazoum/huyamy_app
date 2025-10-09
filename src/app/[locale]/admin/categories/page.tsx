"use client";
import DataTable from "@/components/admin/DataTable";
import CategoryFormModal from "@/components/admin/modals/CategoryFormModal";
import { Category, Language } from "@/types";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CategoriesPage: React.FC = () => {
  const lang = "ar" as Language;
  const categories: Category[] = [
    {
      id: "cat-1",
      name: { ar: "العناية بالبشرة", fr: "Soins de la peau" },
      slug: "soins-de-la-peau",
      description: {
        ar: "كل ما تحتاجينه لبشرة نضرة وصحية.",
        fr: "Tout ce dont vous avez besoin pour une peau fraîche et saine.",
      },
      image: "https://placehold.co/200x200/f3e0e6/ffffff?text=بشرة",
    },
    {
      id: "cat-2",
      name: { ar: "العناية بالشعر", fr: "Soins des cheveux" },
      slug: "soins-des-cheveux",
      description: {
        ar: "منتجات طبيعية لتقوية وتغذية شعرك.",
        fr: "Produits naturels pour renforcer et nourrir vos cheveux.",
      },
      image: "https://placehold.co/200x200/f0e6d3/ffffff?text=شعر",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    console.log("Form submitted!");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    handleCloseModal();
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
            className="w-12 h-12 rounded-full object-cover"
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
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الفئات</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">فئة جديدة</span>
          <span className="sm:hidden">إضافة</span>
        </button>
      </div>
      <DataTable
        columns={columns}
        data={categories}
        renderActions={(item: Category) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenEditModal(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Edit size={18} />
            </button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />
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
