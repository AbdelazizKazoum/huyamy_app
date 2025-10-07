"use client";

import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import DateInput from "@/components/admin/ui/DateInput";
import SearchInput from "@/components/admin/ui/SearchInput";
import useSortableData from "@/hooks/useSortableData";
import { Language } from "@/types";
import { Edit, Eye } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

type Order = {
  id: string;
  customerName: string;
  date: Date;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  itemCount: number;
};

const OrdersPage: React.FC = () => {
  const params = useParams();
  const lang = params.locale as Language;
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const generatedOrders: Order[] = Array.from({ length: 25 }, (_, i) => ({
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
    setOrders(generatedOrders);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all"
  );
  const itemsPerPage = 5;

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch =
          !searchTerm ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate =
          !dateFilter ||
          order.date.toISOString().split("T")[0].includes(dateFilter);

        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesDate && matchesStatus;
      }),
    [orders, searchTerm, dateFilter, statusFilter]
  );

  const {
    items: sortedOrders,
    requestSort,
    sortConfig,
  } = useSortableData<Order>(filteredOrders, {
    key: "date",
    direction: "descending",
  });

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
  const statusOptions: { id: Order["status"] | "all"; label: string }[] = [
    { id: "all", label: "الكل" },
    { id: "pending", label: "قيد الانتظار" },
    { id: "shipped", label: "تم الشحن" },
    { id: "delivered", label: "تم التوصيل" },
    { id: "cancelled", label: "ملغي" },
  ];
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 self-start md:self-center">
          إدارة الطلبات
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="...ابحث بالاسم أو رقم الطلب"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="font-semibold text-gray-700 whitespace-nowrap">
            تصفية حسب:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => {
                  setStatusFilter(status.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                  statusFilter === status.id
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DateInput
            id="date-filter"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              setDateFilter(dateFilter === today ? "" : today);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors text-sm ${
              dateFilter === new Date().toISOString().split("T")[0]
                ? "bg-green-700 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            اليوم
          </button>
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

export default OrdersPage;
