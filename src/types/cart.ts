import { Product, ProductVariant } from "./product";

// Define the structure for an item in the cart
export interface CartItem {
  cartItemId: string; // A unique ID for this specific line item in the cart
  product: Product;
  quantity: number;
  selected: boolean;
  selectedVariant: ProductVariant | null; // The selected variant, if any
}

export type CartItemType = CartItem;
