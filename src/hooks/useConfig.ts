// Client-side only hooks for config management
import { useEffect } from "react";
import { SiteConfig } from "@/types";
import { useConfigStore } from "@/store/useConfigStore";

/**
 * Client-side hook for accessing config data
 * ONLY USE IN CLIENT COMPONENTS (with "use client" directive)
 */
export function useConfig(): {
  config: SiteConfig | null;
  isLoading: boolean;
  error: string | null;
} {
  const store = useConfigStore();

  useEffect(() => {
    // On client, if store doesn't have config, fetch it
    if (!store.config && !store.isLoading) {
      store.fetchConfig().catch((error) => {
        console.error("Failed to fetch config in useConfig hook:", error);
      });
    }
  }, [store]);

  return {
    config: store.config,
    isLoading: store.isLoading,
    error: store.error,
  };
}

/**
 * Client-side hook for accessing specific config sections
 * ONLY USE IN CLIENT COMPONENTS (with "use client" directive)
 */
export function useConfigSection<K extends keyof SiteConfig>(
  section: K
): {
  data: SiteConfig[K] | null;
  isLoading: boolean;
  error: string | null;
} {
  const store = useConfigStore();

  useEffect(() => {
    // On client, if store doesn't have config, fetch it
    if (!store.config && !store.isLoading) {
      store.fetchConfig().catch((error) => {
        console.error(`Failed to fetch config section ${section}:`, error);
      });
    }
  }, [store, section]);

  return {
    data: store.config?.[section] || null,
    isLoading: store.isLoading,
    error: store.error,
  };
}
