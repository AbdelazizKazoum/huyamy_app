"use server";

import { unstable_cache } from "next/cache";
import { getSiteConfig } from "@/lib/services/configService";
import { CACHE_CONFIG, CACHE_TAGS } from "@/lib/cache/tags";
import { SiteConfig } from "@/types";

/**
 * Server action to fetch site configuration with ISR caching
 * This avoids API calls and provides server-side caching
 */
export const getCachedSiteConfig = unstable_cache(
  async (): Promise<SiteConfig | null> => {
    try {
      const config = await getSiteConfig();

      if (process.env.NODE_ENV !== "production") {
        console.log("📋 Fetched cached site config");
      }

      return config;
    } catch (error) {
      console.error("❌ Error fetching cached site config:", error);
      throw new Error("Failed to fetch site configuration");
    }
  },
  CACHE_CONFIG.CONFIG.key,
  {
    // No automatic revalidation - cache indefinitely until manually revalidated
    tags: CACHE_CONFIG.CONFIG.tags,
  }
);

/**
 * Server action to fetch specific config sections with caching
 * Useful for components that only need certain parts of the config
 */
export const getCachedConfigSection = unstable_cache(
  async (
    section: keyof SiteConfig
  ): Promise<SiteConfig[keyof SiteConfig] | null> => {
    try {
      const config = await getSiteConfig();

      if (process.env.NODE_ENV !== "production") {
        console.log(`📋 Fetched cached config section: ${section}`);
      }

      return config?.[section] || null;
    } catch (error) {
      console.error(
        `❌ Error fetching cached config section ${section}:`,
        error
      );
      throw new Error(`Failed to fetch config section: ${section}`);
    }
  },
  ["config-section"],
  {
    // No automatic revalidation - cache indefinitely until manually revalidated
    tags: CACHE_CONFIG.CONFIG.tags,
  }
);

/**
 * Server action to check if config exists (useful for conditional rendering)
 */
export const hasSiteConfig = unstable_cache(
  async (): Promise<boolean> => {
    try {
      const config = await getSiteConfig();
      return config !== null;
    } catch (error) {
      console.error("❌ Error checking site config existence:", error);
      return false;
    }
  },
  ["config-exists"],
  {
    // No automatic revalidation - cache indefinitely until manually revalidated
    tags: CACHE_CONFIG.CONFIG.tags,
  }
);

/**
 * Force revalidate the config cache (useful after admin updates)
 * This can be called from admin actions to invalidate the cache
 */
export async function revalidateConfigCache() {
  "use server";

  try {
    // Import revalidateTag dynamically to avoid issues
    const { revalidateTag } = await import("next/cache");

    revalidateTag(CACHE_TAGS.CONFIG);

    if (process.env.NODE_ENV !== "production") {
      console.log("🔄 Revalidated config cache");
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error revalidating config cache:", error);
    throw new Error("Failed to revalidate config cache");
  }
}

/**
 * Utility functions for server components (non-hook versions)
 * These can be used directly in server components without hooks
 */

export async function getConfigData(): Promise<SiteConfig | null> {
  return await getCachedSiteConfig();
}

export async function getConfigSection<K extends keyof SiteConfig>(
  section: K
): Promise<SiteConfig[K] | null> {
  return (await getCachedConfigSection(section)) as SiteConfig[K] | null;
}

export async function getConfigValue(): Promise<boolean> {
  return await hasSiteConfig();
}
