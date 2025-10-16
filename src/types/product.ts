import { LocalizedString } from "./common";
import { Category } from "./category";

/**
 * Defines a type of option for a product.
 * Example: { name: { ar: "الحجم", fr: "Taille" }, values: ["S", "M", "L"] }
 */
export type VariantOption = {
  name: LocalizedString; // The name of the option in multiple languages
  values: string[]; // The available choices for this option
};

/**
 * Defines a specific, purchasable combination of options.
 * Each variant can have its own price and image.
 */
export type ProductVariant = {
  id: string; // A unique ID for this variant, e.g., "prod1-size-s-color-red"
  price: number;
  originalPrice?: number;
  image?: string; // Optional: A specific image for this variant
  // A map of the selected options for this variant.
  // Example: { "Size": "S", "Color": "Red" }
  options: {
    [optionName: string]: string;
  };
};

export type Product = {
  id: string;
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  category: Category;
  categoryId: string;
  isNew: boolean;
  keywords: string[];
  createdAt?: string | null;
  updatedAt?: string | null;
  allowDirectPurchase?: boolean;
  allowAddToCart?: boolean;
  certificationImages?: string[];

  // --- Variant Logic ---
  // The base price is now the default or starting price.
  // It can be overridden by the price in a specific ProductVariant.
  price: number;
  originalPrice?: number;
  image: string; // The main product image.
  subImages: string[];

  // Defines the types of variants available (e.g., Size, Color).
  variantOptions?: VariantOption[];

  // Lists all purchasable combinations of the options.
  variants?: ProductVariant[];
};
