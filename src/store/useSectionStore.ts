import { create } from "zustand";
import { SectionWithProducts } from "@/types";
import {
  fetchAllSectionsAPI,
  createSectionAPI,
  updateSectionAPI,
  deleteSectionAPI,
} from "@/lib/api/sections";

// Define the state structure
interface SectionState {
  sections: SectionWithProducts[];
  isLoading: boolean;
  error: string | null;
  fetchSections: () => Promise<void>;
  addSection: (formData: FormData) => Promise<void>;
  updateSection: (sectionId: string, formData: FormData) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
}

// Create the store
export const useSectionStore = create<SectionState>((set, get) => ({
  sections: [],
  isLoading: false,
  error: null,

  // Action to fetch all sections
  fetchSections: async () => {
    set({ isLoading: true, error: null });
    try {
      const sections = await fetchAllSectionsAPI();
      set({ sections, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Action to add a new section
  addSection: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      // For simplicity and data consistency, we refetch all sections after adding.
      await createSectionAPI(formData);
      await get().fetchSections();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error; // Re-throw to be caught in the component
    }
  },

  // Action to update an existing section
  updateSection: async (sectionId: string, formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await updateSectionAPI(sectionId, formData);
      // Refetch all sections to ensure data consistency.
      await get().fetchSections();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Action to delete a section
  deleteSection: async (sectionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteSectionAPI(sectionId);
      set((state) => ({
        sections: state.sections.filter((s) => s.id !== sectionId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
