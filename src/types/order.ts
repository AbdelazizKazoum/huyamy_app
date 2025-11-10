import { LocalizedString } from "./common";

export interface OrderData {
  products: Array<{
    id: string;
    name: LocalizedString;
    price: number;
    quantity: number;
    image: string;
    variant: Record<string, string> | null;
  }>;
  shippingInfo: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    email?: string;
  };
  orderDate: string;
  totalAmount: number;
  locale: "ar" | "fr";
  paymentMethod: "cod" | "card";
  paymentIntentId?: string;
}

export interface Order extends OrderData {
  id: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: Date | null;
  updatedAt: Date | null;
}
