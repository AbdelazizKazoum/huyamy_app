"use client";

import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/ui/SearchInput";
import useSortableData from "@/hooks/useSortableData";
import { Category, Language, Product } from "@/types";
import { Edit, Eye, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const ProductsPage: React.FC = () => {
  const lang = "ar" as Language;

  const categoriesData: Category[] = useMemo(
    () => [
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
    ],
    []
  );

  const products: Product[] = useMemo(
    () => [
      {
        id: "prod-1",
        name: { ar: "كريم مرطب بالصبار", fr: "Crème hydratante à l'aloe vera" },
        slug: "كريم-مرطب-بالصبار",
        price: 85.0,
        originalPrice: 120.0,
        image: "https://placehold.co/400x400/d1e4d1/ffffff?text=منتج+1",
        isNew: true,
        description: {
          ar: "كريم غني بخلاصة الصبار الطبيعي لترطيب عميق وتهدئة البشرة الحساسة.",
          fr: "Crème riche en extrait naturel d'aloe vera pour une hydratation profonde.",
        },
        category: categoriesData[0],
        subImages: [],
        keywords: ["كريم", "صبار", "ترطيب"],
      },
      {
        id: "prod-2",
        name: { ar: "زيت الأرغان الأصلي", fr: "Huile d'argan authentique" },
        slug: "زيت-الأرغان-الأصلي",
        price: 150.0,
        image: "https://placehold.co/400x400/e4d8c8/ffffff?text=منتج+2",
        isNew: false,
        description: {
          ar: "زيت الأرغان المغربي النقي 100% لتغذية الشعر والبشرة والأظافر.",
          fr: "Huile d'argan marocaine 100% pure pour nourrir les cheveux, la peau et les ongles.",
        },
        category: categoriesData[1],
        subImages: [],
        keywords: ["زيت", "أرغان", "شعر", "بشرة"],
      },
      {
        id: "prod-3",
        name: { ar: "شامبو ضد القشرة", fr: "Shampooing anti-pelliculaire" },
        slug: "شامبو-ضد-القشرة",
        price: 95.0,
        image: "https://placehold.co/400x400/cce0ff/ffffff?text=منتج+3",
        isNew: false,
        description: {
          ar: "شامبو فعال للقضاء على القشرة وتهدئة فروة الرأس.",
          fr: "Shampooing efficace pour éliminer les pellicules et apaiser le cuir chevelu.",
        },
        category: categoriesData[1],
        subImages: [],
        keywords: ["شامبو", "قشرة", "شعر"],
      },
      {
        id: "prod-4",
        name: { ar: "واقي شمسي SPF 50", fr: "Écran solaire SPF 50" },
        slug: "واقي-شمسي-spf-50",
        price: 130.0,
        image: "https://placehold.co/400x400/fff0b3/ffffff?text=منتج+4",
        isNew: true,
        description: {
          ar: "حماية عالية من أشعة الشمس الضارة مع تركيبة خفيفة وغير دهنية.",
          fr: "Haute protection contre les rayons UV nocifs avec une formule légère et non grasse.",
        },
        category: categoriesData[0],
        subImages: [],
        keywords: ["واقي شمسي", "حماية", "بشرة"],
      },
      {
        id: "prod-5",
        name: { ar: "مقشر الجسم بالقهوة", fr: "Gommage corps au café" },
        slug: "مقشر-الجسم-بالقهوة",
        price: 110.0,
        image: "https://placehold.co/400x400/d4bca2/ffffff?text=منتج+5",
        isNew: false,
        description: {
          ar: "مقشر طبيعي لتنشيط الدورة الدموية وإزالة الجلد الميت.",
          fr: "Gommage naturel pour stimuler la circulation et éliminer les peaux mortes.",
        },
        category: categoriesData[0],
        subImages: [],
        keywords: ["مقشر", "قهوة", "جسم"],
      },
      {
        id: "prod-6",
        name: { ar: "بلسم مرطب للشعر", fr: "Après-shampooing hydratant" },
        slug: "بلسم-مرطب-للشعر",
        price: 90.0,
        image: "https://placehold.co/400x400/e0d1e4/ffffff?text=منتج+6",
        isNew: false,
        description: {
          ar: "بلسم لفك تشابك الشعر وتغذيته بعمق.",
          fr: "Après-shampooing pour démêler et nourrir les cheveux en profondeur.",
        },
        category: categoriesData[1],
        subImages: [],
        keywords: ["بلسم", "شعر", "ترطيب"],
      },
      {
        id: "prod-7",
        name: { ar: "سيروم فيتامين سي", fr: "Sérum à la vitamine C" },
        slug: "سيروم-فيتامين-سي",
        price: 180.0,
        image: "https://placehold.co/400x400/ffe5b4/ffffff?text=منتج+7",
        isNew: true,
        description: {
          ar: "سيروم لتفتيح البشرة ومحاربة علامات التقدم في السن.",
          fr: "Sérum pour éclaircir le teint et combattre les signes de l'âge.",
        },
        category: categoriesData[0],
        subImages: [],
        keywords: ["سيروم", "فيتامين سي", "بشرة"],
      },
    ],
    [categoriesData]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowercasedFilter = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.ar.toLowerCase().includes(lowercasedFilter) ||
        product.name.fr.toLowerCase().includes(lowercasedFilter)
    );
  }, [products, searchTerm]);

  const { items: sortedProducts } = useSortableData<Product>(filteredProducts);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: {
    key: keyof Product;
    label: string;
    sortable: boolean;
    render?: (item: Product) => React.ReactNode;
  }[] = [
    {
      key: "name",
      label: "المنتج",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-4">
          <Image
            src={item.image}
            alt={item.name[lang as keyof typeof item.name]}
            width={48}
            height={48}
            className="w-12 h-12 rounded-md object-cover"
          />
          <span className="font-medium text-gray-800">
            {item.name[lang as keyof typeof item.name]}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "الفئة",
      sortable: true,
      render: (item) =>
        item.category.name[lang as keyof typeof item.category.name],
    },
    {
      key: "price",
      label: "السعر",
      sortable: true,
      render: (item) => (
        <span className="font-mono">{item.price.toFixed(2)} د.م.</span>
      ),
    },
  ];
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 self-start md:self-center">
          إدارة المنتجات
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="...ابحث عن منتج"
          />
          <button className="bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors w-full md:w-auto justify-center">
            <PlusCircle size={20} />
            <span className="hidden sm:inline">منتج جديد</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={paginatedProducts}
        renderActions={() => (
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
              <Eye size={18} />
            </button>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
              <Edit size={18} />
            </button>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductsPage;
