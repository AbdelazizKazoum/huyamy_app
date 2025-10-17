/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import {
  getOrdersWithPagination,
  createGuestOrder,
  OrderFilters,
  PaginationOptions,
} from "@/lib/services/orderService";
import { requireAdmin } from "@/lib/utils/requireAdmin";

// GET /api/admin/orders - Fetch orders with pagination and filters
export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // Filter parameters
    const filters: OrderFilters = {
      status: (searchParams.get("status") as any) || "all",
      searchTerm: searchParams.get("search") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      customerName: searchParams.get("customerName") || undefined,
    };

    const pagination: PaginationOptions = {
      limit,
      page, // Pass page number instead of lastDocId
    };

    const result = await getOrdersWithPagination(pagination, filters);

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total: result.total,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.products || !orderData.shippingInfo) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: products and shippingInfo",
        },
        { status: 400 }
      );
    }

    const result = await createGuestOrder(orderData);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
