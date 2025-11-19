// lib/cache/tags.ts
// Cache tags configuration for ISR and manual revalidation

/**
 * Individual cache tags for specific data types
 */
export const CACHE_TAGS = {
  PRODUCTS: "products",
  PRODUCT_DETAIL: "product-detail",
  CATEGORIES: "categories",
  SECTIONS: "sections",
  CONFIG: "config",
} as const;

/**
 * Master cache tags for broader invalidation
 */
export const MASTER_CACHE_TAGS = {
  LANDING_PAGE: "landing-page",
  ALL_CONTENT: "all-content",
  SEO_META: "seo-meta",
} as const;

/**
 * All available cache tags (individual + master)
 */
export const ALL_CACHE_TAGS = {
  ...CACHE_TAGS,
  ...MASTER_CACHE_TAGS,
} as const;

/**
 * Get all valid individual tags as an array
 */
export const getValidTags = (): string[] => {
  return Object.values(CACHE_TAGS);
};

/**
 * Get all valid tags (including master tags) as an array
 */
export const getAllValidTags = (): string[] => {
  return Object.values(ALL_CACHE_TAGS);
};

/**
 * Check if a tag is valid
 */
export const isValidTag = (tag: string): boolean => {
  return getAllValidTags().includes(tag);
};

/**
 * Get landing page related tags
 */
export const getLandingPageTags = (): string[] => {
  return [CACHE_TAGS.PRODUCTS, CACHE_TAGS.CATEGORIES, CACHE_TAGS.SECTIONS];
};

/**
 * Get product detail specific tag for a slug
 */
export const getProductDetailTag = (slug: string): string => {
  return `${CACHE_TAGS.PRODUCT_DETAIL}-${slug}`;
};

/**
 * Cache tag configurations for different data types
 */
export const CACHE_CONFIG = {
  PRODUCTS: {
    tags: [
      CACHE_TAGS.PRODUCTS,
      MASTER_CACHE_TAGS.LANDING_PAGE,
      MASTER_CACHE_TAGS.ALL_CONTENT,
      MASTER_CACHE_TAGS.SEO_META,
    ],
    revalidate: 604800, // 7 days
    key: ["products"],
  },
  PRODUCT_DETAIL: {
    tags: [
      CACHE_TAGS.PRODUCT_DETAIL,
      MASTER_CACHE_TAGS.ALL_CONTENT,
      MASTER_CACHE_TAGS.SEO_META,
    ],
    revalidate: 604800, // 7 days
    key: ["product-detail"],
  },
  CATEGORIES: {
    tags: [
      CACHE_TAGS.CATEGORIES,
      MASTER_CACHE_TAGS.LANDING_PAGE,
      MASTER_CACHE_TAGS.ALL_CONTENT,
      MASTER_CACHE_TAGS.SEO_META,
    ],
    revalidate: 604800, // 7 days
    key: ["categories"],
  },
  SECTIONS: {
    tags: [
      CACHE_TAGS.SECTIONS,
      MASTER_CACHE_TAGS.LANDING_PAGE,
      MASTER_CACHE_TAGS.ALL_CONTENT,
      MASTER_CACHE_TAGS.SEO_META,
    ],
    revalidate: 604800, // 7 days
    key: ["landing-page-sections"],
  },
  CONFIG: {
    tags: [
      CACHE_TAGS.CONFIG,
      MASTER_CACHE_TAGS.ALL_CONTENT,
      MASTER_CACHE_TAGS.SEO_META,
    ],
    revalidate: 604800, // 7 days
    key: ["site-config"],
  },
};

/**
 * Type definitions for cache tags
 */
export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
export type MasterCacheTag =
  (typeof MASTER_CACHE_TAGS)[keyof typeof MASTER_CACHE_TAGS];
export type AllCacheTag = CacheTag | MasterCacheTag;
