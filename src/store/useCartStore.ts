import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types"; // Assuming you have a Product type

// Define the structure for an item in the cart
export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

// Define the state structure for the cart
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleItemSelected: (productId: string) => void;
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

      // Action to add an item to the cart with a specific quantity
      addItem: (product, quantity) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          // If item already exists, increment its quantity by the added amount
          const updatedItems = items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
        } else {
          // If item is new, add it to the cart with the specified quantity
          set({
            items: [
              ...items,
              { product, quantity, selected: true }, // Default to selected
            ],
          });
        }
      },

      // Action to remove an item from the cart
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      // Action to update the quantity of an item
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          // If quantity is 0 or less, remove the item
          get().removeItem(productId);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          }));
        }
      },

      // Action to toggle the 'selected' state of an item
      toggleItemSelected: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
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

      // Add the implementation for toggleSelectAll
      toggleSelectAll: (selected) => {
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected })),
        }));
      },

      // Add the new action implementation
      removeSelectedItems: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.selected),
        }));
      },
    }),
    {
      name: "cart-storage", // Unique name for local storage
    }
  )
);
