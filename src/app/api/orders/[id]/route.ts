import { NextRequest, NextResponse } from "next/server";
import {
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "@/lib/services/orderService";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/orders/[id] - Get a specific order
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // Validate status
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status. Must be one of: " + validStatuses.join(", "),
        },
        { status: 400 }
      );
    }

    const result = await updateOrderStatus(id, status);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);

    if (error instanceof Error && error.message === "Order not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/orders/[id] - Delete an order
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await deleteOrder(id);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);

    if (error instanceof Error && error.message === "Order not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
