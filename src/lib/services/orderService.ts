/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb, default as admin, adminAuth } from "@/lib/firebaseAdmin";
import { OrderData } from "@/types/order";

// Type for order filters
export interface OrderFilters {
  status?: "pending" | "shipped" | "delivered" | "cancelled" | "all";
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  customerName?: string;
}

// Type for pagination
export interface PaginationOptions {
  limit: number;
  lastDocId?: string;
  startAfter?: any;
}

// Type for paginated response
export interface PaginatedOrdersResponse {
  orders: any[];
  lastDoc: any;
  hasMore: boolean;
  total: number;
}

/**
 * Creates an order for an unauthenticated "guest" user.
 * This is ideal for public-facing checkout forms.
 * @param {OrderData} orderData - The validated order data.
 */
export async function createGuestOrder(orderData: OrderData) {
  const orderRef = adminDb.collection("orders").doc();
  await orderRef.set({
    ...orderData,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Guest order created with ID: ${orderRef.id}`);
  return { id: orderRef.id };
}

/**
 * Creates an order for a signed-in user.
 * Use this when you can provide a user's auth token.
 * @param {string} token - The Firebase ID token of the authenticated user.
 * @param {any} orderData - The data for the order.
 */
export async function createAuthenticatedOrder(token: string, orderData: any) {
  const decoded = await adminAuth.verifyIdToken(token); // throws if invalid
  const uid = decoded.uid;

  const orderRef = adminDb.collection("orders").doc();
  await orderRef.set({
    userId: uid,
    ...orderData,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(
    `Authenticated order created for user ${uid} with ID: ${orderRef.id}`
  );
  return { id: orderRef.id };
}

/**
 * Updates the status of an order
 * @param {string} orderId - The order ID
 * @param {string} status - The new status
 */
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "shipped" | "delivered" | "cancelled"
) {
  try {
    const orderRef = adminDb.collection("orders").doc(orderId);

    // Check if order exists
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      throw new Error("Order not found");
    }

    await orderRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Order ${orderId} status updated to: ${status}`);
    return { success: true, orderId, status };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

/**
 * Fetches orders with pagination and filters
 * @param {PaginationOptions} pagination - Pagination options
 * @param {OrderFilters} filters - Filter options
 */
export async function getOrdersWithPagination(
  pagination: PaginationOptions,
  filters: OrderFilters = {}
): Promise<PaginatedOrdersResponse> {
  try {
    let query = adminDb.collection("orders").orderBy("createdAt", "desc");

    // Apply filters
    if (filters.status && filters.status !== "all") {
      query = query.where("status", "==", filters.status);
    }

    // Date filters
    if (filters.dateFrom) {
      const fromDate = admin.firestore.Timestamp.fromDate(
        new Date(filters.dateFrom)
      );
      query = query.where("createdAt", ">=", fromDate);
    }

    if (filters.dateTo) {
      const toDate = admin.firestore.Timestamp.fromDate(
        new Date(new Date(filters.dateTo).setHours(23, 59, 59, 999))
      );
      query = query.where("createdAt", "<=", toDate);
    }

    // Pagination
    if (pagination.startAfter) {
      query = query.startAfter(pagination.startAfter);
    }

    query = query.limit(pagination.limit);

    const snapshot = await query.get();

    // Get total count for the filtered query (without pagination)
    let countQuery = adminDb.collection("orders");

    if (filters.status && filters.status !== "all") {
      //@ts-ignore
      countQuery = countQuery.where("status", "==", filters.status);
    }

    if (filters.dateFrom) {
      const fromDate = admin.firestore.Timestamp.fromDate(
        new Date(filters.dateFrom)
      );
      //@ts-ignore
      countQuery = countQuery.where("createdAt", ">=", fromDate);
    }

    if (filters.dateTo) {
      const toDate = admin.firestore.Timestamp.fromDate(
        new Date(new Date(filters.dateTo).setHours(23, 59, 59, 999))
      );
      //@ts-ignore
      countQuery = countQuery.where("createdAt", "<=", toDate);
    }

    const countSnapshot = await countQuery.count().get();
    const total = countSnapshot.data().count;

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || null,
      updatedAt: doc.data().updatedAt?.toDate?.() || null,
    }));

    // Filter by search term (client-side for flexibility with name search)
    let filteredOrders = orders;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredOrders = orders.filter((order) => {
        //@ts-ignore
        const customerName = order.shippingInfo?.fullName?.toLowerCase() || "";
        const orderId = order.id.toLowerCase();
        //@ts-ignore
        const phone = order.shippingInfo?.phone || "";

        return (
          customerName.includes(searchLower) ||
          orderId.includes(searchLower) ||
          phone.includes(searchLower)
        );
      });
    }

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    const hasMore = snapshot.docs.length === pagination.limit;

    return {
      orders: filteredOrders,
      lastDoc,
      hasMore,
      total,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

/**
 * Gets a single order by ID
 * @param {string} orderId - The order ID
 */
export async function getOrderById(orderId: string) {
  try {
    const orderDoc = await adminDb.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return null;
    }

    const data = orderDoc.data();
    return {
      id: orderDoc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || null,
      updatedAt: data?.updatedAt?.toDate?.() || null,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

/**
 * Deletes an order
 * @param {string} orderId - The order ID
 */
export async function deleteOrder(orderId: string) {
  try {
    const orderRef = adminDb.collection("orders").doc(orderId);

    // Check if order exists
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      throw new Error("Order not found");
    }

    await orderRef.delete();

    console.log(`Order ${orderId} deleted successfully`);
    return { success: true, orderId };
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}
