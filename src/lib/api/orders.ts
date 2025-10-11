/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderFilters } from "@/store/useOrderStore";

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

interface OrdersResponse {
  orders: any[];
  lastDoc: any;
  hasMore: boolean;
  total: number;
}

// Build query parameters for orders API
const buildOrdersQuery = (
  page: number,
  limit: number,
  filters: OrderFilters,
  lastDocId?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status: filters.status,
  });

  if (filters.searchTerm) {
    params.append("search", filters.searchTerm);
  }

  if (filters.dateFrom) {
    params.append("dateFrom", filters.dateFrom);
  }

  if (filters.dateTo) {
    params.append("dateTo", filters.dateTo);
  }

  if (lastDocId) {
    params.append("lastDocId", lastDocId);
  }

  return params.toString();
};

/**
 * Fetch orders with pagination and filters
 */
export const fetchOrders = async (
  page: number,
  limit: number,
  filters: OrderFilters,
  lastDocId?: string
): Promise<OrdersResponse> => {
  try {
    const query = buildOrdersQuery(page, limit, filters, lastDocId);
    const response = await fetch(`/api/orders?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<OrdersResponse> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch orders");
    }

    return result.data!;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch orders"
    );
  }
};

/**
 * Fetch a single order by ID
 */
export const fetchOrderById = async (id: string) => {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Order not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch order");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch order"
    );
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  id: string,
  status: "pending" | "shipped" | "delivered" | "cancelled"
) => {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Order not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to update order status");
    }

    return result.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update order status"
    );
  }
};

/**
 * Delete an order
 */
export const deleteOrder = async (id: string) => {
  try {
    const response = await fetch(`/api/orders/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Order not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to delete order");
    }

    return result.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete order"
    );
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData: any) => {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to create order");
    }

    return result.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create order"
    );
  }
};

/**
 * Get order statistics (optional - for dashboard)
 */
export const getOrderStats = async () => {
  try {
    const response = await fetch("/api/orders/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch order statistics");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch order statistics"
    );
  }
};
