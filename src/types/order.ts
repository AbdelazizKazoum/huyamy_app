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
    address: string;
  };
  orderDate: string;
  totalAmount: number;
  locale: "ar" | "fr";
}
