"use client";
import DataTable from "@/components/admin/DataTable";
import { Category, Language } from "@/types";
import { Edit, PlusCircle, Trash2 } from "lucide-react";

const CategoriesPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const categories: Category[] = [
    {
      id: "cat-1",
      name: { ar: "العناية بالبشرة", fr: "Soins de la peau" },
      description: {
        ar: "كل ما تحتاجينه لبشرة نضرة وصحية.",
        fr: "Tout ce dont vous avez besoin pour une peau fraîche et saine.",
      },
      image: "https://placehold.co/200x200/f3e0e6/ffffff?text=بشرة",
    },
    {
      id: "cat-2",
      name: { ar: "العناية بالشعر", fr: "Soins des cheveux" },
      description: {
        ar: "منتجات طبيعية لتقوية وتغذية شعرك.",
        fr: "Produits naturels pour renforcer et nourrir vos cheveux.",
      },
      image: "https://placehold.co/200x200/f0e6d3/ffffff?text=شعر",
    },
  ];

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
          <img
            src={item.image}
            alt={item.name[lang]}
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
        <button className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors">
          <PlusCircle size={20} />
          <span className="hidden sm:inline">فئة جديدة</span>
          <span className="sm:hidden">إضافة</span>
        </button>
      </div>
      <DataTable
        columns={columns}
        data={categories}
        renderActions={() => (
          <div className="flex gap-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
              <Edit size={18} />
            </button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default CategoriesPage;
