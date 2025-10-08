import { create } from "zustand";
import { Product } from "@/types";
import {
  fetchAllProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
} from "@/lib/api/products";

// Define the state structure
interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (formData: FormData) => Promise<void>;
  updateProduct: (productId: string, formData: FormData) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

// Create the store
export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  // Action to fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await fetchAllProductsAPI();
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Action to add a new product
  addProduct: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await createProductAPI(formData);
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error; // Re-throw to be caught in the component if needed
    }
  },

  // Action to update an existing product
  updateProduct: async (productId: string, formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await updateProductAPI(productId, formData);
      // Refetch all products to ensure data consistency after update.
      // A more optimized approach could be to update the single item in the state.
      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Action to delete a product
  deleteProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProductAPI(productId);
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
