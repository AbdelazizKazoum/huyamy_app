// lib/services/configService.ts
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

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
}

const CONFIG_DOC_ID = "site-config";

// Get the entire config document
export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const doc = await adminDb.collection("config").doc(CONFIG_DOC_ID).get();

    if (!doc.exists) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Site config document not found, returning null");
      }
      return null;
    }

    const data = doc.data();
    if (process.env.NODE_ENV !== "production") {
      console.log("Retrieved site config:", data);
    }

    return data as SiteConfig;
  } catch (error) {
    console.error("Error fetching site config:", error);
    throw new Error("Failed to fetch site configuration");
  }
}

// Update or create the entire config document
export async function updateSiteConfig(
  configData: Partial<SiteConfig>
): Promise<void> {
  try {
    const configRef = adminDb.collection("config").doc(CONFIG_DOC_ID);

    // Check if document exists
    const doc = await configRef.get();
    const exists = doc.exists;

    if (!exists) {
      // Create new document
      const createData = {
        ...configData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      await configRef.set(createData);
      if (process.env.NODE_ENV !== "production") {
        console.log("Created new site config document");
      }
    } else {
      // Update existing document
      const updateData = {
        ...configData,
        updatedAt: FieldValue.serverTimestamp(),
      };
      await configRef.update(updateData);
      if (process.env.NODE_ENV !== "production") {
        console.log("Updated existing site config document");
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Site config updated:", configData);
    }
  } catch (error) {
    console.error("Error updating site config:", error);
    throw new Error("Failed to update site configuration");
  }
}

// Update specific sections
export async function updateBasicInfo(data: {
  name?: string;
  brandName?: string;
  url?: string;
}): Promise<void> {
  try {
    await updateSiteConfig({
      name: data.name,
      brandName: data.brandName,
      url: data.url,
    });
  } catch (error) {
    console.error("Error updating basic info:", error);
    throw error;
  }
}

export async function updateBrandAssets(data: {
  logo?: string;
  banner?: string;
  favicon?: string;
}): Promise<void> {
  try {
    await updateSiteConfig({
      logo: data.logo,
      banner: data.banner,
      favicon: data.favicon,
    });
  } catch (error) {
    console.error("Error updating brand assets:", error);
    throw error;
  }
}

export async function updateStoreSettings(data: {
  category?: string;
  defaultLocale?: "ar" | "fr";
  currencies?: {
    ar: string;
    fr: string;
  };
}): Promise<void> {
  try {
    const updateData: Partial<SiteConfig> = {
      category: data.category,
    };

    if (data.defaultLocale) {
      updateData.i18n = {
        defaultLocale: data.defaultLocale,
        locales: ["ar", "fr"], // Keep both locales
      };
    }

    if (data.currencies) {
      updateData.currencies = data.currencies;
    }

    await updateSiteConfig(updateData);
  } catch (error) {
    console.error("Error updating store settings:", error);
    throw error;
  }
}

export async function updateTranslatedContent(data: {
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
}): Promise<void> {
  try {
    await updateSiteConfig({
      titleTemplate: data.titleTemplate,
      title: data.title,
      description: data.description,
      niche: data.niche,
      keywords: data.keywords,
    });
  } catch (error) {
    console.error("Error updating translated content:", error);
    throw error;
  }
}

export async function updateLocationVerification(data: {
  location?: string;
  locationCoordinates?: {
    lat?: number;
    lng?: number;
  };
  verification?: {
    google?: string;
  };
}): Promise<void> {
  try {
    await updateSiteConfig({
      location: data.location,
      locationCoordinates: data.locationCoordinates,
      verification: data.verification,
    });
  } catch (error) {
    console.error("Error updating location verification:", error);
    throw error;
  }
}

export async function updateContactInfo(data: {
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
}): Promise<void> {
  try {
    await updateSiteConfig({
      contact: data.contact,
    });
  } catch (error) {
    console.error("Error updating contact info:", error);
    throw error;
  }
}

export async function updateSocialMedia(data: {
  social?: {
    twitter?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}): Promise<void> {
  try {
    await updateSiteConfig({
      social: data.social,
      socialLinks: data.socialLinks,
    });
  } catch (error) {
    console.error("Error updating social media:", error);
    throw error;
  }
}

// Test function to verify the service is working correctly
export async function testConfigService(): Promise<void> {
  console.log("🧪 Testing Config Service...");

  try {
    // Test 1: Get current config
    console.log("📋 Getting current config...");
    const config = await getSiteConfig();
    console.log("Current config:", config);

    // Test 2: Update basic info
    console.log("📝 Updating basic info...");
    await updateBasicInfo({
      name: "Test Store",
      brandName: "Test Brand",
      url: "https://teststore.com",
    });
    console.log("✅ Basic info updated");

    // Test 3: Get updated config
    console.log("📋 Getting updated config...");
    const updatedConfig = await getSiteConfig();
    console.log("Updated config:", updatedConfig);

    console.log("✅ Config service test completed successfully!");
  } catch (error) {
    console.error("❌ Config service test failed:", error);
  }
}
