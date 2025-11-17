// store/useConfigStore.ts
import { create } from "zustand";
import { SiteConfig } from "@/types";
import {
  fetchSiteConfigAPI,
  updateBasicInfoAPI,
  updateBrandAssetsAPI,
  updateStoreSettingsAPI,
  updateTranslatedContentAPI,
  updateLocationVerificationAPI,
  updateContactInfoAPI,
  updateSocialMediaAPI,
} from "@/lib/api/config";

// Define the state structure
interface ConfigState {
  config: SiteConfig | null;
  isLoading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  updateBasicInfo: (data: {
    name?: string;
    brandName?: string;
    url?: string;
  }) => Promise<void>;
  updateBrandAssets: (data: {
    logo?: string;
    banner?: string;
    favicon?: string;
  }) => Promise<void>;
  updateStoreSettings: (data: {
    category?: string;
    defaultLocale?: "ar" | "fr";
    currencies?: {
      ar: string;
      fr: string;
    };
  }) => Promise<void>;
  updateTranslatedContent: (data: {
    titleTemplate?: string;
    title?: {
      ar?: string;
      fr?: string;
    };
    description?: {
      ar?: string;
      fr?: string;
    };
    niche?: {
      ar?: string;
      fr?: string;
    };
    keywords?: {
      ar?: string[];
      fr?: string[];
    };
  }) => Promise<void>;
  updateLocationVerification: (data: {
    location?: string;
    locationCoordinates?: {
      lat?: number;
      lng?: number;
    };
    verification?: {
      google?: string;
    };
  }) => Promise<void>;
  updateContactInfo: (data: {
    contact?: {
      email?: string;
      phone?: string;
      whatsapp?: string;
    };
  }) => Promise<void>;
  updateSocialMedia: (data: {
    social?: {
      twitter?: string;
    };
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  }) => Promise<void>;
}

// Create the store
export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  isLoading: false,
  error: null,

  // Action to fetch the entire config
  fetchConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      const config = await fetchSiteConfigAPI();
      set({ config, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Action to update basic info
  updateBasicInfo: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await updateBasicInfoAPI(data);
      // Update local state
      set((state) => ({
        config: {
          ...state.config,
          ...data,
        } as SiteConfig,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error; // Re-throw to be caught in the component
    }
  },

  // Action to update brand assets
  updateBrandAssets: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await updateBrandAssetsAPI(data);
      // Update local state
      set((state) => ({
        config: {
          ...state.config,
          ...data,
        } as SiteConfig,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Action to update store settings
  updateStoreSettings: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await updateStoreSettingsAPI(data);
      // Update local state
      set((state) => ({
        config: {
          ...state.config,
          category: data.category,
          i18n: data.defaultLocale
            ? {
                defaultLocale: data.defaultLocale,
                locales: ["ar", "fr"],
              }
            : state.config?.i18n,
          currencies: data.currencies || state.config?.currencies,
        } as SiteConfig,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Action to update translated content
  updateTranslatedContent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await updateTranslatedContentAPI(data);
      // Update local state
      set((state) => ({
        config: {
          ...state.config,
          titleTemplate: data.titleTemplate,
          title: data.title || state.config?.title,
          description: data.description || state.config?.description,
          niche: data.niche || state.config?.niche,
          keywords: data.keywords || state.config?.keywords,
        } as SiteConfig,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Action to update location verification
  updateLocationVerification: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await updateLocationVerificationAPI(data);
      // Update local state
      set((state) => ({
        config: {
          ...state.config,
          location: data.location,
          locationCoordinates:
            data.locationCoordinates || state.config?.locationCoordinates,
          verification: data.verification || state.config?.verification,
        } as SiteConfig,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Action to update contact info
  updateContactInfo: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await updateContactInfoAPI(data);
      // Update local state
      set((state) => ({
        config: {
          ...state.config,
          contact: data.contact || state.config?.contact,
        } as SiteConfig,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Action to update social media
  updateSocialMedia: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await updateSocialMediaAPI(data);
      // Update local state
      set((state) => ({
        config: {
          ...state.config,
          social: data.social || state.config?.social,
          socialLinks: data.socialLinks || state.config?.socialLinks,
        } as SiteConfig,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
