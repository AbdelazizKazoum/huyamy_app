import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductVariant } from "@/types";

// Define the structure for an item in the cart
export interface CartItem {
  cartItemId: string; // A unique ID for this specific line item in the cart
  product: Product;
  quantity: number;
  selected: boolean;
  selectedVariant: ProductVariant | null; // The selected variant, if any
}

// Define the state structure for the cart
interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity: number,
    selectedVariant: ProductVariant | null
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleItemSelected: (cartItemId: string) => void;
  clearCart: () => void;
  getSelectedItems: () => CartItem[];
  toggleSelectAll: (selected: boolean) => void;
  removeSelectedItems: () => void;
}

// Create the store with persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Action to add an item to the cart with a specific quantity and variant
      addItem: (product, quantity, selectedVariant) => {
        const { items } = get();
        // A unique ID for the combination of product and variant
        const variantIdentifier = selectedVariant
          ? selectedVariant.id
          : "no-variant";

        const existingItem = items.find(
          (item) =>
            item.product.id === product.id &&
            (item.selectedVariant?.id ?? "no-variant") === variantIdentifier
        );

        if (existingItem) {
          // If item with the same variant already exists, increment its quantity
          const updatedItems = items.map((item) =>
            item.cartItemId === existingItem.cartItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
        } else {
          // If item is new or a new variant, add it to the cart
          const cartItemId = `${product.id}-${variantIdentifier}-${Date.now()}`;
          const newItem: CartItem = {
            cartItemId,
            product,
            quantity,
            selectedVariant,
            selected: true, // Default to selected
          };
          set({
            items: [...items, newItem],
          });
        }
      },

      // Action to remove an item from the cart using its unique cartItemId
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      // Action to update the quantity of an item using its unique cartItemId
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.cartItemId === cartItemId ? { ...item, quantity } : item
            ),
          }));
        }
      },

      // Action to toggle the 'selected' state of an item using its unique cartItemId
      toggleItemSelected: (cartItemId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, selected: !item.selected }
              : item
          ),
        }));
      },

      // Action to clear all items from the cart
      clearCart: () => {
        set({ items: [] });
      },

      // Selector to get only the selected items
      getSelectedItems: () => {
        return get().items.filter((item) => item.selected);
      },

      // Action to toggle select all items
      toggleSelectAll: (selected) => {
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected })),
        }));
      },

      // Action to remove all selected items
      removeSelectedItems: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.selected),
        }));
      },
    }),
    {
      name: "huyamy-cart-storage", // Make it unique to your app
    }
  )
);
