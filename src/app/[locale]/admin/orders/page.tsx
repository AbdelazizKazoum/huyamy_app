"use client";

import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import DateInput from "@/components/admin/ui/DateInput";
import SearchInput from "@/components/admin/ui/SearchInput";
import useSortableData from "@/hooks/useSortableData";
import { Language } from "@/types";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useOrderStore, Order } from "@/store/useOrderStore";
import { toast } from "react-hot-toast";
import OrderViewModal from "@/components/admin/modals/OrderViewModal";

// Loading Skeleton Components
const OrderRowSkeleton = () => (
  <tr className="border-b border-gray-200">
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
    </td>
    <td className="p-4">
      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
    </td>
  </tr>
);

const OrdersSkeletonTable = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 text-right text-sm font-semibold text-gray-700">
              رقم الطلب
            </th>
            <th className="p-4 text-right text-sm font-semibold text-gray-700">
              العميل
            </th>
            <th className="p-4 text-right text-sm font-semibold text-gray-700">
              التاريخ
            </th>
            <th className="p-4 text-right text-sm font-semibold text-gray-700">
              الحالة
            </th>
            <th className="p-4 text-right text-sm font-semibold text-gray-700">
              الإجمالي
            </th>
            <th className="p-4 text-right text-sm font-semibold text-gray-700">
              المنتجات
            </th>
            <th className="p-4 text-right text-sm font-semibold text-gray-700">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, index) => (
            <OrderRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const FiltersSkeleton = () => (
  <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-8 bg-gray-200 rounded-full animate-pulse w-20"
          ></div>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-16"></div>
    </div>
  </div>
);

const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
    <div className="h-8 bg-gray-200 rounded animate-pulse w-48 self-start md:self-center"></div>
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse flex-1 md:w-64"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  </div>
);

const SummarySkeleton = () => (
  <div className="mb-4">
    <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
  </div>
);

const OrdersPage: React.FC = () => {
  const params = useParams();
  const lang = params.locale as Language;

  // Zustand store
  const {
    orders,
    loading,
    error,
    filters,
    pagination,
    fetchOrders,
    setFilters,
    resetFilters,
    setPage,
    clearError,
    updateOrderStatus,
  } = useOrderStore();

  // Local state for UI
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch orders on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      await fetchOrders(true); // Reset and fetch fresh data
      setIsInitialLoading(false);
    };
    loadInitialData();
  }, [fetchOrders]);

  // Fetch orders when filters change
  useEffect(() => {
    if (
      filters.status !== "all" ||
      filters.searchTerm ||
      filters.dateFrom ||
      filters.dateTo
    ) {
      fetchOrders(true); // Reset pagination when filters change
    }
  }, [filters, fetchOrders]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Handle search with debounce
  const handleSearch = useCallback(
    (searchTerm: string) => {
      setFilters({ searchTerm });
    },
    [setFilters]
  );

  // Handle status filter
  const handleStatusFilter = useCallback(
    (status: Order["status"] | "all") => {
      setFilters({ status });
    },
    [setFilters]
  );

  // Handle date filters
  const handleDateFilter = useCallback(
    (dateFrom: string, dateTo?: string) => {
      setFilters({ dateFrom, dateTo: dateTo || "" });
    },
    [setFilters]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      fetchOrders(false); // Don't reset, just load more
    },
    [setPage, fetchOrders]
  );

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchOrders(true);
    setIsRefreshing(false);
    toast.success("تم تحديث الطلبات بنجاح");
  }, [fetchOrders]);

  // Handle status update from modal
  const handleModalStatusUpdate = useCallback(
    async (orderId: string, newStatus: Order["status"]) => {
      setIsUpdatingStatus(true);
      try {
        await updateOrderStatus(orderId, newStatus);
        toast.success("تم تحديث حالة الطلب بنجاح");

        // Update the selected order in local state
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            status: newStatus,
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        toast.error("فشل في تحديث حالة الطلب");
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [updateOrderStatus, selectedOrder]
  );

  // Handle view order
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    if (isUpdatingStatus) return;
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Sort orders (client-side for UI responsiveness)
  const {
    items: sortedOrders,
    requestSort,
    sortConfig,
  } = useSortableData<Order>(orders, {
    key: "createdAt",
    direction: "descending",
  });

  // Calculate total pages
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Status options
  const statusOptions: { id: Order["status"] | "all"; label: string }[] = [
    { id: "all", label: "الكل" },
    { id: "pending", label: "قيد الانتظار" },
    { id: "shipped", label: "تم الشحن" },
    { id: "delivered", label: "تم التوصيل" },
    { id: "cancelled", label: "ملغي" },
  ];

  // Get status chip component (read-only for table)
  const getStatusChip = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            قيد الانتظار
          </span>
        );
      case "shipped":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            تم الشحن
          </span>
        );
      case "delivered":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            تم التوصيل
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            ملغي
          </span>
        );
    }
  };

  // Table columns
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
      render: (item) => (
        <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: "shippingInfo" as keyof Order,
      label: "العميل",
      sortable: true,
      render: (item) => (
        <div>
          <span className="font-medium text-gray-800 block">
            {item.shippingInfo.fullName}
          </span>
          <span className="text-sm text-gray-500">
            {item.shippingInfo.phone}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "التاريخ",
      sortable: true,
      render: (item) => (
        <div>
          <span className="block">
            {item.createdAt?.toLocaleDateString("ar-MA") || "غير محدد"}
          </span>
          <span className="text-sm text-gray-500">
            {item.createdAt?.toLocaleTimeString("ar-MA", {
              hour: "2-digit",
              minute: "2-digit",
            }) || ""}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (item) => getStatusChip(item.status),
    },
    {
      key: "totalAmount",
      label: "الإجمالي",
      sortable: true,
      render: (item) => (
        <span className="font-mono font-semibold">
          {item.totalAmount.toFixed(2)} د.م.
        </span>
      ),
    },
    {
      key: "products" as keyof Order,
      label: "المنتجات",
      sortable: false,
      render: (item) => (
        <span className="text-sm text-gray-600">
          {item.products.length} منتج
        </span>
      ),
    },
  ];

  // Show initial loading skeleton
  if (isInitialLoading && orders.length === 0) {
    return (
      <div>
        <HeaderSkeleton />
        <FiltersSkeleton />
        <SummarySkeleton />
        <OrdersSkeletonTable />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 self-start md:self-center">
          إدارة الطلبات ({pagination.total})
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchInput
            value={filters.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="...ابحث بالاسم أو رقم الطلب"
          />
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            title="تحديث"
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="font-semibold text-gray-700 whitespace-nowrap">
            تصفية حسب:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusFilter(status.id)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                  filters.status === status.id
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
            id="date-from"
            value={filters.dateFrom}
            onChange={(e) => handleDateFilter(e.target.value, filters.dateTo)}
            placeholder="من تاريخ"
          />
          <DateInput
            id="date-to"
            value={filters.dateTo}
            onChange={(e) => handleDateFilter(filters.dateFrom, e.target.value)}
            placeholder="إلى تاريخ"
          />
          <button
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              handleDateFilter(today, today);
            }}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors text-sm ${
              filters.dateFrom === new Date().toISOString().split("T")[0]
                ? "bg-green-700 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            اليوم
          </button>
          {(filters.dateFrom ||
            filters.dateTo ||
            filters.searchTerm ||
            filters.status !== "all") && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              مسح المرشحات
            </button>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="mb-4 text-sm text-gray-600">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            جاري التحميل...
          </div>
        ) : (
          <span>
            عرض {orders.length} من أصل {pagination.total} طلب
          </span>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedOrders}
        loading={loading && !isInitialLoading}
        sortConfig={sortConfig}
        onSort={requestSort}
        renderActions={(order) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleViewOrder(order)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="عرض التفاصيل"
            >
              <Eye size={18} />
            </button>
          </div>
        )}
        emptyMessage="لا توجد طلبات"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          hasMore={pagination.hasMore}
          loading={loading}
        />
      )}

      {/* Order View Modal */}
      <OrderViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        lang={lang}
        onStatusUpdate={handleModalStatusUpdate}
        isUpdating={isUpdatingStatus}
      />

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
