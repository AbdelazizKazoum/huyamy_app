// types/config.ts

export interface SiteConfig {
  // Basic Info
  name?: string;
  brandName?: string;
  url?: string;

  // Brand Assets
  logo?: string;
  banner?: string;
  favicon?: string;

  // Store Settings
  category?: string;
  i18n?: {
    defaultLocale: "ar" | "fr";
    locales: ("ar" | "fr")[];
  };
  currencies?: {
    ar: string;
    fr: string;
  };

  // Translated Content
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

  // Location & Verification
  location?: string;
  locationCoordinates?: {
    lat?: number;
    lng?: number;
  };
  verification?: {
    google?: string;
  };

  // Contact Info
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };

  // Social Media
  social?: {
    twitter?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };

  // Additional metadata (from site config)
  authors?: { name: string; url?: string }[];
  creator?: string;
  publisher?: string;
  baseUrl?: string;
  manifest?: string;
  themeColor?: string;
}
