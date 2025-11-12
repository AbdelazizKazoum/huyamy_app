import { CartItem } from "../types/cart";
import { products } from "./products";

export const initialCartItems: CartItem[] = [
  {
    cartItemId: "mock-cart-item-1",
    product: products[1],
    quantity: 1,
    selected: true,
    selectedVariant: null,
  },
];
