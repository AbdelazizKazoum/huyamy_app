"use client";
import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import DateInput from "@/components/admin/ui/DateInput";
import SearchInput from "@/components/admin/ui/SearchInput";
import SelectInput from "@/components/admin/ui/SelectInput";
import useSortableData from "@/hooks/useSortableData";
import { Language } from "firebase/ai";
import { Edit, Eye } from "lucide-react";
import { useMemo, useState } from "react";
type Order = {
  id: string;
  customerName: string;
  date: Date;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  itemCount: number;
};

const OrdersPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const orders: Order[] = Array.from({ length: 25 }, (_, i) => ({
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

export default OrdersPage;
