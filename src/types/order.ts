export interface OrderData {
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
    city?: string;
    address: string;
    email?: string;
  };
  orderDate: string;
  totalAmount: number;
  locale: "ar" | "fr";
}

export interface Order extends OrderData {
  id: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: Date | null;
  updatedAt: Date | null;
}
