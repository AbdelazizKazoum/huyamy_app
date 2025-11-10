/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as ordersApi from "@/lib/api/orders";
import { OrderData } from "@/types/order";

// Types
export interface Order {
  id: string;
  products: Array<{
    id: string;
    name: Record<string, string>;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
  };
  orderDate: string;
  totalAmount: number;
  locale: "ar" | "fr";
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface OrderFilters {
  status: "pending" | "shipped" | "delivered" | "cancelled" | "all";
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  lastDocId?: string;
}

interface OrderStore {
  // State
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  pagination: OrderPagination;

  // Actions
  fetchOrders: (reset?: boolean) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  createOrder: (orderData: OrderData) => Promise<void>;
  setFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  clearError: () => void;
  clearSelectedOrder: () => void;
  setLoading: (loading: boolean) => void;
}

const initialFilters: OrderFilters = {
  status: "all",
  searchTerm: "",
  dateFrom: "",
  dateTo: "",
};

const initialPagination: OrderPagination = {
  page: 1,
  limit: 10,
  total: 0,
  hasMore: false,
};

// Helper function to transform API data to Order type
const transformOrder = (order: any): Order => ({
  ...order,
  createdAt: order.createdAt ? new Date(order.createdAt) : null,
  updatedAt: order.updatedAt ? new Date(order.updatedAt) : null,
});

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      orders: [],
      selectedOrder: null,
      loading: false,
      error: null,
      filters: initialFilters,
      pagination: initialPagination,

      // Fetch orders with pagination and filters
      fetchOrders: async (reset = false) => {
        set({ loading: true, error: null });

        try {
          const { filters, pagination } = get();
          const currentPage = reset ? 1 : pagination.page;

          // Don't pass lastDocId when resetting or changing pages
          // Let the backend handle offset-based pagination using the page number
          const result = await ordersApi.fetchOrders(
            currentPage,
            pagination.limit,
            filters,
            undefined // Remove lastDocId - use page-based pagination instead
          );

          const transformedOrders = result.orders.map(transformOrder);

          set((state) => ({
            orders: transformedOrders,
            pagination: {
              ...state.pagination,
              page: currentPage,
              total: result.total,
              hasMore: result.hasMore,
              lastDocId: result.lastDoc?.id, // Keep for reference but don't use for pagination
            },
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            loading: false,
          });
        }
      },

      // Fetch a specific order by ID
      fetchOrderById: async (id: string) => {
        set({ loading: true, error: null });

        try {
          const result = await ordersApi.fetchOrderById(id);
          const transformedOrder = transformOrder(result);

          set({
            selectedOrder: transformedOrder,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            loading: false,
          });
        }
      },

      // Update order status
      updateOrderStatus: async (id: string, status: Order["status"]) => {
        set({ loading: true, error: null });

        try {
          await ordersApi.updateOrderStatus(id, status);

          // Update the order in the store
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id
                ? { ...order, status, updatedAt: new Date() }
                : order
            ),
            selectedOrder:
              state.selectedOrder?.id === id
                ? { ...state.selectedOrder, status, updatedAt: new Date() }
                : state.selectedOrder,
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            loading: false,
          });
        }
      },

      // Delete order
      deleteOrder: async (id: string) => {
        set({ loading: true, error: null });

        try {
          await ordersApi.deleteOrder(id);

          // Remove the order from the store
          set((state) => ({
            orders: state.orders.filter((order) => order.id !== id),
            selectedOrder:
              state.selectedOrder?.id === id ? null : state.selectedOrder,
            pagination: {
              ...state.pagination,
              total: state.pagination.total - 1,
            },
            loading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            loading: false,
          });
        }
      },

      // Create order
      createOrder: async (orderData: OrderData) => {
        set({ loading: true, error: null });

        try {
          const result = await ordersApi.createOrder(orderData);

          // Optionally refresh orders or add the new order to the state
          // For now, we'll just clear loading state
          set({ loading: false });

          return result;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            loading: false,
          });
          throw error;
        }
      },

      // Set filters
      setFilters: (newFilters: Partial<OrderFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...initialPagination }, // Reset pagination when filters change
        }));
      },

      // Reset filters
      resetFilters: () => {
        set({
          filters: initialFilters,
          pagination: initialPagination,
        });
      },

      // Set page
      setPage: (page: number) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear selected order
      clearSelectedOrder: () => {
        set({ selectedOrder: null });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: "order-store",
    }
  )
);
