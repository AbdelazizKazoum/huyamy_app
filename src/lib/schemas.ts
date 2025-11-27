import { z } from "zod";

// Define the validation schema for the checkout form
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
});

// Define the shape of the state object that our Server Action will return
export type FormState = {
  message: string;
  errors?: {
    fullName?: string[];
    phone?: string[];
    address?: string[];
  };
};

// Validation schemas for admin parameters
export const basicInfoSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  brandName: z.string().min(1, "Brand name is required"),
  url: z.string().url("Invalid URL"),
});

export const brandAssetsSchema = z.object({
  logo: z.string().optional(),
  banner: z.string().optional(),
  favicon: z.string().optional(),
});

export const storeSettingsSchema = z.object({
  category: z.string().min(1, "Category is required"),
  defaultLocale: z.enum(["ar", "fr"]),
  currencies: z.object({
    ar: z.string().min(1, "Arabic currency is required"),
    fr: z.string().min(1, "French currency is required"),
  }),
});

export const translatedContentSchema = z.object({
  titleTemplate: z.string().min(1, "Title template is required"),
  title: z.record(z.enum(["ar", "fr"]), z.string().min(1, "Title is required")),
  description: z.record(
    z.enum(["ar", "fr"]),
    z.string().min(1, "Description is required")
  ),
  niche: z.record(z.enum(["ar", "fr"]), z.string().min(1, "Niche is required")),
  keywords: z.record(z.enum(["ar", "fr"]), z.array(z.string())),
});

export const locationVerificationSchema = z.object({
  location: z.string().min(1, "Location is required"),
  locationCoordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  verification: z
    .object({
      google: z.string().optional(),
    })
    .optional(),
});

export const contactInfoSchema = z.object({
  contact: z.object({
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    whatsapp: z.string().min(1, "WhatsApp is required"),
  }),
});

export const socialMediaSchema = z.object({
  social: z.object({
    twitter: z.string().min(1, "Twitter handle is required"),
  }),
  socialLinks: z.object({
    facebook: z
      .string()
      .url("Invalid Facebook URL")
      .optional()
      .or(z.literal("")),
    instagram: z
      .string()
      .url("Invalid Instagram URL")
      .optional()
      .or(z.literal("")),
    twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  }),
});
