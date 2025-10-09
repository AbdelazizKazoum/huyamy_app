import { create } from "zustand";
import { Category } from "@/types";
import {
  fetchAllCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
} from "@/lib/api/categories";

// Define the state structure
interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (formData: FormData) => Promise<void>;
  updateCategory: (categoryId: string, formData: FormData) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

// Create the store
export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  // Action to fetch all categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await fetchAllCategoriesAPI();
      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Action to add a new category
  addCategory: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await createCategoryAPI(formData);
      set((state) => ({
        categories: [...state.categories, newCategory].sort((a, b) =>
          a.name.ar.localeCompare(b.name.ar)
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error; // Re-throw to be caught in the component
    }
  },

  // Action to update an existing category
  updateCategory: async (categoryId: string, formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await updateCategoryAPI(categoryId, formData);
      // Refetch all categories to ensure data consistency.
      await get().fetchCategories();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Action to delete a category
  deleteCategory: async (categoryId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteCategoryAPI(categoryId);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
