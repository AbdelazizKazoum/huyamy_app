"use client";

import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import DateInput from "@/components/admin/ui/DateInput";
import SearchInput from "@/components/admin/ui/SearchInput";
import { Language } from "@/types";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useOrderStore, Order } from "@/store/useOrderStore";
import { toast } from "react-hot-toast";
import OrderViewModal from "@/components/admin/modals/OrderViewModal";
import { useTranslations } from "next-intl";

// Loading Skeleton Components
const OrderRowSkeleton = () => (
  <tr className="border-b border-gray-200">
    <td className="p-2 sm:p-4">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-12 sm:w-20"></div>
    </td>
    <td className="p-2 sm:p-4">
      <div className="space-y-1 sm:space-y-2">
        <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-20 sm:w-32"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-16 sm:w-24"></div>
      </div>
    </td>
    <td className="p-2 sm:p-4 hidden sm:table-cell">
      <div className="space-y-1 sm:space-y-2">
        <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-16 sm:w-24"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-12 sm:w-16"></div>
      </div>
    </td>
    <td className="p-2 sm:p-4">
      <div className="h-5 sm:h-6 bg-gray-200 rounded-full animate-pulse w-16 sm:w-20"></div>
    </td>
    <td className="p-2 sm:p-4 hidden md:table-cell">
      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-12 sm:w-16"></div>
    </td>
    <td className="p-2 sm:p-4 hidden lg:table-cell">
      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-8 sm:w-12"></div>
    </td>
    <td className="p-2 sm:p-4">
      <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded animate-pulse"></div>
    </td>
  </tr>
);

const OrdersSkeletonTable = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-2 sm:p-4 text-right text-xs sm:text-sm font-semibold text-gray-700 min-w-[80px]">
              رقم الطلب
            </th>
            <th className="p-2 sm:p-4 text-right text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">
              العميل
            </th>
            <th className="p-2 sm:p-4 text-right text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px] hidden sm:table-cell">
              التاريخ
            </th>
            <th className="p-2 sm:p-4 text-right text-xs sm:text-sm font-semibold text-gray-700 min-w-[90px]">
              الحالة
            </th>
            <th className="p-2 sm:p-4 text-right text-xs sm:text-sm font-semibold text-gray-700 min-w-[80px] hidden md:table-cell">
              الإجمالي
            </th>
            <th className="p-2 sm:p-4 text-right text-xs sm:text-sm font-semibold text-gray-700 min-w-[80px] hidden lg:table-cell">
              المنتجات
            </th>
            <th className="p-2 sm:p-4 text-right text-xs sm:text-sm font-semibold text-gray-700 min-w-[60px]">
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
  <div className="mb-6 space-y-4">
    {/* Status Filters Skeleton */}
    <div className="flex flex-col gap-3">
      <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-8 bg-gray-200 rounded-full animate-pulse w-16 sm:w-20"
          ></div>
        ))}
      </div>
    </div>

    {/* Date Filters Skeleton */}
    <div className="flex flex-col gap-3">
      <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-16"></div>
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
    <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-40 sm:w-48 self-start md:self-center"></div>
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse flex-1 md:w-64"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  </div>
);

const SummarySkeleton = () => (
  <div className="mb-4">
    <div className="h-4 bg-gray-200 rounded animate-pulse w-32 sm:w-40"></div>
  </div>
);

// Mobile-specific loading skeleton
const MobileOrderCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
    <div className="flex justify-between items-start mb-3">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const MobileSkeletonView = () => (
  <div className="block sm:hidden">
    {Array.from({ length: 6 }).map((_, index) => (
      <MobileOrderCardSkeleton key={index} />
    ))}
  </div>
);

const OrdersPage: React.FC = () => {
  const params = useParams();
  const lang = params.locale as Language;
  const t = useTranslations("admin.orders");

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
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Ref to track if initial load is complete
  const hasInitiallyLoaded = useRef(false);

  // Fetch orders on component mount - ONLY ONCE
  useEffect(() => {
    const loadInitialData = async () => {
      if (hasInitiallyLoaded.current) return; // Prevent multiple initial loads

      setIsInitialLoading(true);
      await fetchOrders(true); // Reset and fetch fresh data
      setIsInitialLoading(false);
      hasInitiallyLoaded.current = true; // Mark as initially loaded
    };

    loadInitialData();
  }, [fetchOrders]);

  // Fetch orders when filters change - BUT NOT on initial load
  useEffect(() => {
    // Skip if initial loading hasn't completed yet
    if (!hasInitiallyLoaded.current || isInitialLoading) {
      return;
    }

    const applyFilters = async () => {
      setIsFilterLoading(true);
      await fetchOrders(true); // Reset pagination when filters change
      setIsFilterLoading(false);
    };

    applyFilters();
  }, [filters, fetchOrders]); // Removed isInitialLoading dependency

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

  // Handle status filter - Only trigger if it's actually different
  const handleStatusFilter = useCallback(
    (status: Order["status"] | "all") => {
      // Only update if the status is actually different
      if (filters.status !== status) {
        setFilters({ status });
      }
    },
    [setFilters, filters.status]
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
    async (page: number) => {
      setPage(page);
      await fetchOrders(false); // Don't reset, just load the new page
    },
    [setPage, fetchOrders]
  );

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchOrders(true);
    setIsRefreshing(false);
    toast.success(t("toasts.refreshSuccess"));
  }, [fetchOrders, t]);

  // Handle status update from modal
  const handleModalStatusUpdate = useCallback(
    async (orderId: string, newStatus: Order["status"]) => {
      setIsUpdatingStatus(true);
      try {
        await updateOrderStatus(orderId, newStatus);
        toast.success(t("toasts.statusUpdateSuccess"));

        // Update the selected order in local state
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            status: newStatus,
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        toast.error(t("toasts.statusUpdateError"));
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [updateOrderStatus, selectedOrder, t]
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

  // Calculate total pages
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Status options
  const statusOptions: { id: Order["status"] | "all"; label: string }[] = [
    { id: "all", label: t("status.all") },
    { id: "pending", label: t("status.pending") },
    { id: "shipped", label: t("status.shipped") },
    { id: "delivered", label: t("status.delivered") },
    { id: "cancelled", label: t("status.cancelled") },
  ];

  // Get status chip component (read-only for table)
  const getStatusChip = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {t("status.pending")}
          </span>
        );
      case "shipped":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {t("status.shipped")}
          </span>
        );
      case "delivered":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {t("status.delivered")}
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {t("status.cancelled")}
          </span>
        );
    }
  };

  // Table columns - Updated to include all fields in mobile
  const columns: {
    key: keyof Order;
    label: string;
    sortable: boolean;
    render?: (item: Order) => React.ReactNode;
    mobileLabel?: string;
    hiddenOnMobile?: boolean;
  }[] = [
    {
      key: "id",
      label: t("table.orderId"),
      mobileLabel: t("mobile.orderId"),
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs sm:text-sm">
          {item.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: "shippingInfo" as keyof Order,
      label: t("table.customer"),
      mobileLabel: t("mobile.customer"),
      sortable: true,
      render: (item) => (
        <div>
          <span className="font-medium text-gray-800 block text-xs sm:text-sm">
            {item.shippingInfo.fullName}
          </span>
          <span className="text-xs text-gray-500">
            {item.shippingInfo.phone}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: t("table.date"),
      mobileLabel: t("mobile.date"),
      sortable: true,
      hiddenOnMobile: false, // Changed from hidden to visible on mobile
      render: (item) => (
        <div>
          <span className="block text-xs sm:text-sm">
            {item.createdAt?.toLocaleDateString(
              lang === "ar" ? "ar-MA" : "fr-FR"
            ) || t("messages.noOrders")}
          </span>
          <span className="text-xs text-gray-500 hidden sm:inline">
            {item.createdAt?.toLocaleTimeString(
              lang === "ar" ? "ar-MA" : "fr-FR",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ) || ""}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: t("table.status"),
      mobileLabel: t("mobile.status"),
      sortable: true,
      render: (item) => getStatusChip(item.status),
    },
    {
      key: "totalAmount",
      label: t("table.total"),
      mobileLabel: t("mobile.total"),
      sortable: true,
      hiddenOnMobile: false, // Changed from hidden to visible on mobile
      render: (item) => (
        <span className="font-mono font-semibold text-xs sm:text-sm text-green-600">
          {item.totalAmount.toFixed(2)} {lang === "ar" ? "د.م." : "MAD"}
        </span>
      ),
    },
    {
      key: "products" as keyof Order,
      label: t("table.products"),
      mobileLabel: t("mobile.products"),
      sortable: false,
      hiddenOnMobile: false, // Changed from hidden to visible on mobile
      render: (item) => (
        <span className="text-xs sm:text-sm text-gray-600">
          {item.products.length} {lang === "ar" ? "منتج" : "produit(s)"}
        </span>
      ),
    },
  ];

  // Show initial loading skeleton
  if (isInitialLoading && orders.length === 0) {
    return (
      <div className="px-2 sm:px-0">
        <HeaderSkeleton />
        <FiltersSkeleton />
        <SummarySkeleton />
        {/* Show mobile skeleton on mobile, table skeleton on larger screens */}
        <div className="block sm:hidden">
          <MobileSkeletonView />
        </div>
        <div className="hidden sm:block">
          <OrdersSkeletonTable />
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 self-start md:self-center">
          {t("title")} ({pagination.total})
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchInput
            value={filters.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
          />
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing || isFilterLoading}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
            title={t("refresh")}
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Status Filters */}
        <div className="flex flex-col gap-3">
          <div className="font-semibold text-gray-700">{t("filterBy")}</div>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusFilter(status.id)}
                disabled={isFilterLoading}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 disabled:opacity-50 flex items-center gap-1 ${
                  filters.status === status.id
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {status.label}
                {isFilterLoading && filters.status === status.id && (
                  <Loader2 size={12} className="animate-spin" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex flex-col gap-3">
          <div className="font-semibold text-gray-700">{t("filterByDate")}</div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label
                htmlFor="date-from"
                className="text-xs font-medium text-gray-600"
              >
                {t("dateFrom")}
              </label>
              <DateInput
                id="date-from"
                value={filters.dateFrom}
                onChange={(e) =>
                  handleDateFilter(e.target.value, filters.dateTo)
                }
                placeholder={t("selectDate")}
                disabled={isFilterLoading}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label
                htmlFor="date-to"
                className="text-xs font-medium text-gray-600"
              >
                {t("dateTo")}
              </label>
              <DateInput
                id="date-to"
                value={filters.dateTo}
                onChange={(e) =>
                  handleDateFilter(filters.dateFrom, e.target.value)
                }
                placeholder={t("selectDate")}
                disabled={isFilterLoading}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  handleDateFilter(today, today);
                }}
                disabled={isFilterLoading}
                className={`px-4 py-2 font-semibold rounded-lg transition-colors text-sm disabled:opacity-50 whitespace-nowrap ${
                  filters.dateFrom === new Date().toISOString().split("T")[0]
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {t("today")}
              </button>
              {(filters.dateFrom ||
                filters.dateTo ||
                filters.searchTerm ||
                filters.status !== "all") && (
                <button
                  onClick={resetFilters}
                  disabled={isFilterLoading}
                  className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {t("clearFilters")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="mb-4 text-sm text-gray-600">
        {loading || isFilterLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {isFilterLoading
              ? t("messages.applyingFilters")
              : t("messages.loading")}
          </div>
        ) : (
          <span>
            {t("messages.results", {
              count: orders.length,
              total: pagination.total,
            })}
          </span>
        )}
      </div>

      {/* Data Table - Show skeleton when filtering */}
      <div className="overflow-hidden">
        {isFilterLoading ? (
          <>
            {/* Mobile skeleton */}
            <div className="block sm:hidden">
              <MobileSkeletonView />
            </div>
            {/* Desktop skeleton */}
            <div className="hidden sm:block">
              <OrdersSkeletonTable />
            </div>
          </>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={orders}
              isLoading={loading && !isFilterLoading}
              renderActions={(order) => (
                <button
                  onClick={() => handleViewOrder(order)}
                  className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors flex-1 justify-center"
                  title={t("messages.viewDetails")}
                >
                  <Eye size={14} />
                  <span>{t("messages.viewDetails")}</span>
                </button>
              )}
              emptyMessage={t("messages.noOrders")}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isFilterLoading && (
        <Pagination
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          // hasMore={pagination.hasMore}
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <p className="text-red-800 text-sm font-medium">
              {t("messages.errorLoading")}
            </p>
          </div>
          <p className="text-red-700 text-sm mt-2">{error}</p>
          {error.includes("index") && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                {t("messages.indexingMessage")}
              </p>
              <button
                onClick={handleRefresh}
                className="mt-2 px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
              >
                {t("messages.retry")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
