"use client";
import DataTable from "@/components/admin/DataTable";
import { LocalizedString } from "@/types";
import { Language } from "firebase/ai";
import { Edit, PlusCircle, Trash2 } from "lucide-react";

type Section = {
  id: string;
  type: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  ctaProductIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

const SectionsPage: React.FC = () => {
  const lang = "ar" as Language;
  const sections: Section[] = [
    {
      id: "landing-popular",
      type: "landing-page",
      title: { ar: "الأكثر مبيعاً", fr: "Les plus vendus" },
      subtitle: {
        ar: "المنتجات التي يحبها عملاؤنا أكثر",
        fr: "Les produits que nos clients préfèrent",
      },
      ctaProductIds: ["prod-3", "prod-6", "prod-7", "prod-5"],
      createdAt: new Date("2025-10-02T20:50:11Z"),
      updatedAt: new Date("2025-10-02T20:50:11Z"),
    },
    {
      id: "landing-new",
      type: "landing-page",
      title: { ar: "وصل حديثاً", fr: "Nouveautés" },
      subtitle: {
        ar: "اكتشف أحدث إضافاتنا إلى المجموعة",
        fr: "Découvrez nos dernières additions à la collection",
      },
      ctaProductIds: ["prod-1", "prod-4", "prod-9"],
      createdAt: new Date("2025-10-01T10:00:00Z"),
      updatedAt: new Date("2025-10-01T10:00:00Z"),
    },
  ];

  const columns: {
    key: keyof Section;
    label: string;
    sortable: boolean;
    render?: (item: Section) => React.ReactNode;
  }[] = [
    {
      key: "title",
      label: "العنوان",
      sortable: true,
      render: (item) => (
        // @ts-expect-error: LocalizedString index type mismatch
        <span className="font-medium text-gray-800">{item.title[lang]}</span>
      ),
    },
    {
      key: "type",
      label: "النوع",
      sortable: true,
      render: (item) => (
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
          {item.type}
        </span>
      ),
    },
    {
      key: "ctaProductIds",
      label: "عدد المنتجات",
      sortable: false,
      render: (item) => item.ctaProductIds.length,
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الأقسام</h1>
        <button className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors">
          <PlusCircle size={20} />
          <span className="hidden sm:inline">قسم جديد</span>
          <span className="sm:hidden">إضافة</span>
        </button>
      </div>
      <DataTable
        columns={columns}
        data={sections}
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

export default SectionsPage;
