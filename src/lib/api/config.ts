// lib/api/config.ts
import { SiteConfig } from "@/types/config";

/**
 * Fetches the entire site configuration from the API.
 */
export const fetchSiteConfigAPI = async (): Promise<SiteConfig | null> => {
  const response = await fetch("/api/config");
  if (!response.ok) {
    throw new Error("Failed to fetch site configuration");
  }
  return response.json();
};

/**
 * Updates basic info via the API.
 */
export const updateBasicInfoAPI = async (data: {
  name?: string;
  brandName?: string;
  url?: string;
}): Promise<{ success: boolean }> => {
  const response = await fetch("/api/parameters/basic-info", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update basic info");
  }
  return response.json();
};

/**
 * Updates brand assets via the API.
 */
export const updateBrandAssetsAPI = async (data: {
  logo?: File | string;
  banner?: File | string;
  favicon?: File | string;
}): Promise<{ success: boolean }> => {
  const formData = new FormData();

  // Add files or URLs to FormData
  if (data.logo) {
    if (data.logo instanceof File) {
      formData.append("logo", data.logo);
    } else {
      formData.append("logoUrl", data.logo);
    }
  }

  if (data.banner) {
    if (data.banner instanceof File) {
      formData.append("banner", data.banner);
    } else {
      formData.append("bannerUrl", data.banner);
    }
  }

  if (data.favicon) {
    if (data.favicon instanceof File) {
      formData.append("favicon", data.favicon);
    } else {
      formData.append("faviconUrl", data.favicon);
    }
  }

  const response = await fetch("/api/parameters/brand-assets", {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update brand assets");
  }
  return response.json();
};

/**
 * Updates store settings via the API.
 */
export const updateStoreSettingsAPI = async (data: {
  category?: string;
  defaultLocale?: "ar" | "fr";
  currencies?: {
    ar: string;
    fr: string;
  };
}): Promise<{ success: boolean }> => {
  const response = await fetch("/api/parameters/store-settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update store settings");
  }
  return response.json();
};

/**
 * Updates translated content via the API.
 */
export const updateTranslatedContentAPI = async (data: {
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
}): Promise<{ success: boolean }> => {
  const response = await fetch("/api/parameters/translated-content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update translated content");
  }
  return response.json();
};

/**
 * Updates location and verification via the API.
 */
export const updateLocationVerificationAPI = async (data: {
  location?: string;
  locationCoordinates?: {
    lat?: number;
    lng?: number;
  };
  verification?: {
    google?: string;
  };
}): Promise<{ success: boolean }> => {
  const response = await fetch("/api/parameters/location-verification", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Failed to update location verification"
    );
  }
  return response.json();
};

/**
 * Updates contact info via the API.
 */
export const updateContactInfoAPI = async (data: {
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
}): Promise<{ success: boolean }> => {
  const response = await fetch("/api/parameters/contact-info", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update contact info");
  }
  return response.json();
};

/**
 * Updates social media via the API.
 */
export const updateSocialMediaAPI = async (data: {
  social?: {
    twitter?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}): Promise<{ success: boolean }> => {
  const response = await fetch("/api/parameters/social-media", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update social media");
  }
  return response.json();
};
