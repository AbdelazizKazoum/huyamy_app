import { CartItem } from "../types";
import { products } from "./products";

export const initialCartItems: CartItem[] = [
  {
    product: products[1],
    quantity: 1,
  },
];
