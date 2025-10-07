"use client";
import React, { useState, Fragment, useMemo } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  Layers,
  Search,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ShoppingCart,
  User,
  LogOut,
  Menu as MenuIcon,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Category, Language, LocalizedString, Product } from "@/types";
import useSortableData from "@/hooks/useSortableData";
import Pagination from "@/components/admin/Pagination";

// --- Type Definitions ---

type Section = {
  id: string;
  type: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  ctaProductIds: string[];
  createdAt: Date;
  updatedAt: Date;
};
type Order = {
  id: string;
  customerName: string;
  date: Date;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  itemCount: number;
};

// --- Mock Data ---
const categoriesData: Category[] = [
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
const productsData: Product[] = [
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
];
const sectionsData: Section[] = [
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

const ordersData: Order[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ORD-00${i + 1}`,
  customerName: [
    "أحمد العلوي",
    "فاطمة الزهراء",
    "Youssef Alaoui",
    "Nadia Benjelloun",
    "خالد السعيدي",
    "Amine Tazi",
    "ليلى العامري",
  ][i % 7],
  date: new Date(new Date().setDate(new Date().getDate() - i)),
  status: ["pending", "shipped", "delivered", "cancelled"][
    i % 4
  ] as Order["status"],
  total: 50 + Math.random() * 500,
  itemCount: 1 + Math.floor(Math.random() * 5),
}));

// --- Reusable UI Components ---

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}
const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => (
  <div className="relative w-full md:w-auto">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2.5 pr-10 rounded-lg bg-white border-neutral-200 border focus:outline-none"
    />
    <Search
      size={20}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
  </div>
);
interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}
const SelectInput: React.FC<SelectInputProps> = ({
  value,
  onChange,
  options,
}) => (
  <div className="relative flex-1">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full p-2.5 pr-10 rounded-lg bg-white border-neutral-200 border focus:outline-none min-w-[150px]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);
interface DateInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const DateInput: React.FC<DateInputProps> = ({ onChange }) => (
  <input
    type="date"
    onChange={onChange}
    className="flex-1 p-2.5 rounded-lg bg-white border-neutral-200 border focus:outline-none"
  />
);
interface DataTableProps<T extends object> {
  columns: {
    key: keyof T;
    label: string;
    sortable: boolean;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
}
const DataTable = <T extends { id: string }>({
  columns,
  data,
  renderActions,
}: DataTableProps<T>) => {
  const { items: sortedItems, requestSort, sortConfig } = useSortableData(data);
  const getSortIcon = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key)
      return <ChevronsUpDown size={14} className="text-gray-400" />;
    return sortConfig.direction === "ascending" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };
  return (
    <div className="bg-white/50 rounded-lg shadow-md">
      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="space-y-4 p-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-neutral-200 p-4 space-y-3"
            >
              {columns.map((col) => (
                <div
                  key={`${item.id}-${col.key as string}`}
                  className="flex justify-between items-start"
                >
                  <span className="font-semibold text-sm text-gray-600">
                    {col.label}
                  </span>
                  <div className="text-left">
                    {col.render ? col.render(item) : String(item[col.key])}
                  </div>
                </div>
              ))}
              {renderActions && (
                <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                  <span className="font-semibold text-sm text-gray-600">
                    إجراءات
                  </span>
                  {renderActions(item)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key as string} className="p-4">
                  {col.sortable ? (
                    <button
                      onClick={() => requestSort(col.key)}
                      className="flex items-center gap-2 font-semibold text-sm text-gray-600"
                    >
                      {col.label} {getSortIcon(col.key)}
                    </button>
                  ) : (
                    <span className="font-semibold text-sm text-gray-600">
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
              {renderActions && (
                <th className="p-4 font-semibold text-sm text-gray-600">
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id} className="border-t border-neutral-200">
                {columns.map((col) => (
                  <td
                    key={`${item.id}-${col.key as string}`}
                    className="p-4 text-gray-600"
                  >
                    {col.render ? col.render(item) : String(item[col.key])}
                  </td>
                ))}
                {renderActions && (
                  <td className="p-4">{renderActions(item)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Page Components ---
const Sidebar: React.FC<{
  activePage: string;
  setActivePage: (page: string) => void;
  isCollapsed: boolean;
}> = ({ activePage, setActivePage, isCollapsed }) => {
  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "orders", label: "الطلبات", icon: ShoppingCart },
    { id: "products", label: "المنتجات", icon: Package },
    { id: "categories", label: "الفئات", icon: Tag },
    { id: "sections", label: "الأقسام", icon: Layers },
  ];
  return (
    <aside
      className={`bg-white border-l border-neutral-200 rtl:border-l-0 rtl:border-r rtl:border-neutral-200 flex-col fixed inset-y-0 hidden md:flex transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-center h-16 border-b border-neutral-200 px-4">
        <a href="#" className="flex flex-col items-center leading-none">
          <span
            className={`font-bold text-amber-500 transition-all duration-300 ${
              isCollapsed ? "text-2xl" : "text-3xl"
            }`}
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {isCollapsed ? "H" : "Huyamy"}
          </span>
          {!isCollapsed && (
            <span className="text-xs text-green-800 font-semibold tracking-wider">
              لوحة التحكم
            </span>
          )}
        </a>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.id);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  activePage === item.id
                    ? "bg-green-100 text-green-800 font-bold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
const MobileSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}> = ({ isOpen, onClose, activePage, setActivePage }) => {
  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "orders", label: "الطلبات", icon: ShoppingCart },
    { id: "products", label: "المنتجات", icon: Package },
    { id: "categories", label: "الفئات", icon: Tag },
    { id: "sections", label: "الأقسام", icon: Layers },
  ];
  const handleLinkClick = (page: string) => {
    setActivePage(page);
    onClose();
  };
  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 md:hidden" dir="rtl">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative w-64 bg-white h-full flex flex-col">
            <div className="flex items-center justify-between h-16 border-b border-neutral-200 px-4">
              <a href="#" className="flex flex-col items-start leading-none">
                <span
                  className="text-3xl font-bold text-amber-500"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  Huyamy
                </span>
                <span className="text-xs text-green-800 font-semibold tracking-wider">
                  لوحة التحكم
                </span>
              </a>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.id);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activePage === item.id
                          ? "bg-green-100 text-green-800 font-bold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};
const Header: React.FC<{
  onDesktopSidebarToggle: () => void;
  onMobileSidebarOpen: () => void;
}> = ({ onDesktopSidebarToggle, onMobileSidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 h-16 p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onDesktopSidebarToggle}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full hidden md:block"
        >
          <MenuIcon size={24} />
        </button>
        <button
          onClick={onMobileSidebarOpen}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full md:hidden"
        >
          <MenuIcon size={24} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2"
          >
            <img
              src="https://placehold.co/40x40/d1e4d1/166534?text=A"
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
          </button>
          {isUserMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 z-50">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>تسجيل الخروج</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
const OrdersPage: React.FC<{ orders: Order[]; lang: Language }> = ({
  orders,
  lang,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const itemsPerPage = 5;
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch = order.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        if (!dateFilter) return matchesSearch;
        const orderDate = new Date(order.date);
        orderDate.setHours(0, 0, 0, 0);
        if (dateFilter === "today") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return matchesSearch && orderDate.getTime() === today.getTime();
        }
        if (dateFilter === "this_week") {
          const today = new Date();
          const firstDayOfWeek = new Date(
            today.setDate(
              today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
            )
          );
          firstDayOfWeek.setHours(0, 0, 0, 0);
          return matchesSearch && orderDate >= firstDayOfWeek;
        }
        if (dateFilter.includes("-")) {
          const filterDate = new Date(dateFilter);
          filterDate.setHours(0, 0, 0, 0);
          return matchesSearch && orderDate.getTime() === filterDate.getTime();
        }
        return matchesSearch;
      }),
    [orders, searchTerm, dateFilter]
  );
  const {
    items: sortedOrders,
    requestSort,
    sortConfig,
  } = useSortableData(filteredOrders, { key: "date", direction: "descending" });
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getStatusChip = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            قيد الانتظار
          </span>
        );
      case "shipped":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            تم الشحن
          </span>
        );
      case "delivered":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            تم التوصيل
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            ملغي
          </span>
        );
    }
  };
  const columns: {
    key: keyof Order;
    label: string;
    sortable: boolean;
    render?: (item: Order) => React.ReactNode;
  }[] = [
    {
      key: "id",
      label: "رقم الطلب",
      sortable: true,
      render: (item) => <span className="font-mono">{item.id}</span>,
    },
    {
      key: "customerName",
      label: "العميل",
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-800">{item.customerName}</span>
      ),
    },
    {
      key: "date",
      label: "التاريخ",
      sortable: true,
      render: (item) => new Date(item.date).toLocaleDateString("ar-MA"),
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (item) => getStatusChip(item.status),
    },
    {
      key: "total",
      label: "الإجمالي",
      sortable: true,
      render: (item) => (
        <span className="font-mono">{item.total.toFixed(2)} د.م.</span>
      ),
    },
  ];
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 self-start md:self-center">
          إدارة الطلبات
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="...ابحث بالاسم"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <SelectInput
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              options={[
                { value: "", label: "كل الأوقات" },
                { value: "today", label: "اليوم" },
                { value: "this_week", label: "هذا الأسبوع" },
              ]}
            />
            <DateInput onChange={(e) => setDateFilter(e.target.value)} />
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={paginatedOrders}
        renderActions={() => (
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
              <Eye size={18} />
            </button>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
              <Edit size={18} />
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
const ProductsPage: React.FC<{ products: Product[]; lang: Language }> = ({
  products,
  lang,
}) => {
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

  const { items: sortedProducts } = useSortableData(filteredProducts);

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
          <img
            src={item.image}
            alt={item.name[lang]}
            className="w-12 h-12 rounded-md object-cover"
          />
          <span className="font-medium text-gray-800">{item.name[lang]}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "الفئة",
      sortable: true,
      render: (item) => item.category.name[lang],
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
const CategoriesPage: React.FC<{ categories: Category[]; lang: Language }> = ({
  categories,
  lang,
}) => {
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
        data={categoriesData}
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
const SectionsPage: React.FC<{ sections: Section[]; lang: Language }> = ({
  sections,
  lang,
}) => {
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
        data={sectionsData}
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
const DashboardPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold">لوحة التحكم</h1>
  </div>
);

// --- Main Admin Panel Component ---
export default function AdminPanel() {
  const [activePage, setActivePage] = useState("orders");
  const [lang, setLang] = useState<Language>("ar");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "products":
        return <ProductsPage products={productsData} lang={lang} />;
      case "categories":
        return <CategoriesPage categories={categoriesData} lang={lang} />;
      case "sections":
        return <SectionsPage sections={sectionsData} lang={lang} />;
      case "orders":
        return <OrdersPage orders={ordersData} lang={lang} />;
      default:
        return <DashboardPage />;
    }
  };
  return (
    <div
      dir="rtl"
      className="bg-gray-100 text-gray-900 min-h-screen"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <div className="flex h-screen">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isCollapsed={isSidebarCollapsed}
        />
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarCollapsed ? "md:mr-20" : "md:mr-64"
          }`}
        >
          <Header
            onDesktopSidebarToggle={() =>
              setIsSidebarCollapsed(!isSidebarCollapsed)
            }
            onMobileSidebarOpen={() => setIsMobileMenuOpen(true)}
          />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-20">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
