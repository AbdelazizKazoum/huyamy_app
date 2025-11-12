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
  page?: number;
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
 * Creates an order in the Firestore database.
 * This function is designed to be called from a secure, server-side environment (e.g., a webhook).
 *
 * @param orderData - The complete order data object.
 * @returns The ID of the newly created order document.
 */
export const createOrderInFirestore = async (
  orderData: OrderData
): Promise<string> => {
  try {
    const orderWithTimestamp = {
      ...orderData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "pending", // Initial status
    };

    const orderRef = await adminDb.collection("orders").add(orderWithTimestamp);
    console.log(`Order successfully created with ID: ${orderRef.id}`);
    return orderRef.id;
  } catch (error) {
    console.error("Error creating order in Firestore:", error);
    // Re-throw the error to be handled by the calling function (the webhook)
    throw new Error("Failed to save order to database.");
  }
};

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
export const getOrdersWithPagination = async (
  pagination: PaginationOptions,
  filters: OrderFilters
) => {
  try {
    let query: any = adminDb.collection("orders");

    // Apply filters
    if (filters.status && filters.status !== "all") {
      query = query.where("status", "==", filters.status);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      query = query.where(
        "createdAt",
        ">=",
        admin.firestore.Timestamp.fromDate(fromDate)
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      query = query.where(
        "createdAt",
        "<=",
        admin.firestore.Timestamp.fromDate(toDate)
      );
    }

    // Search by customer name or order ID
    if (filters.searchTerm) {
      // For searching, you might need to fetch all and filter in memory
      // Or implement a proper search solution like Algolia
      query = query
        .where("shippingInfo.fullName", ">=", filters.searchTerm)
        .where("shippingInfo.fullName", "<=", filters.searchTerm + "\uf8ff");
    }

    // Get total count for pagination
    const countSnapshot = await query.get();
    const total = countSnapshot.size;

    // Order by createdAt descending
    query = query.orderBy("createdAt", "desc");

    // **USE OFFSET-BASED PAGINATION INSTEAD OF CURSOR**
    // Calculate offset from page number
    const page = parseInt(pagination.page?.toString() || "1");
    const offset = (page - 1) * pagination.limit;

    query = query.offset(offset).limit(pagination.limit);

    // Execute query
    const snapshot = await query.get();

    const orders = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate().toISOString() || null,
    }));

    const hasMore = offset + orders.length < total;

    return {
      orders,
      total,
      hasMore,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

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
