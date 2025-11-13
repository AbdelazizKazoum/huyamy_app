import { Product, VariantOption, ProductVariant } from "@/types";

/**
 * Validation error messages for product form
 */
export interface ValidationErrors {
  nameAr?: string;
  nameFr?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  price?: string;
  categoryId?: string;
  mainImage?: string;
  purchaseOptions?: string;
  variants?: string;
  [key: string]: string | undefined;
}

export interface CustomSection {
  nameAr: string;
  nameFr: string;
  type: "products" | "description";
  selectedProducts: Product[];
  descriptionAr: string;
  descriptionFr: string;
}

interface ValidateProductFormParams {
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  descriptionFr: string;
  price: number | string;
  selectedCategoryJSON: string;
  hasVariants: boolean;
  variantOptions: VariantOption[];
  variants: ProductVariant[];
  allowDirectPurchase: boolean;
  allowAddToCart: boolean;
  hasCustomSections: boolean;
  customSections: CustomSection[];
  product: Product | null;
  mainImage: File | null;
  t: (key: string) => string;
}

/**
 * Validates the entire product form
 * @returns Object containing validation errors, or empty object if valid
 */
export const validateProductForm = ({
  nameAr,
  nameFr,
  descriptionAr,
  descriptionFr,
  price,
  selectedCategoryJSON,
  hasVariants,
  variantOptions,
  variants,
  allowDirectPurchase,
  allowAddToCart,
  hasCustomSections,
  customSections,
  product,
  mainImage,
  t,
}: ValidateProductFormParams): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Basic fields validation
  if (!nameAr.trim()) errors.nameAr = t("errors.nameAr");
  if (!nameFr.trim()) errors.nameFr = t("errors.nameFr");
  if (!descriptionAr.trim()) errors.descriptionAr = t("errors.descriptionAr");
  if (!descriptionFr.trim()) errors.descriptionFr = t("errors.descriptionFr");

  // Price validation (only if no variants)
  if (!hasVariants && (!price || Number(price) <= 0)) {
    errors.price = t("errors.price");
  }

  // Category validation
  if (!selectedCategoryJSON) errors.categoryId = t("errors.category");

  // Main image validation (only for new products)
  if (!product && !mainImage) {
    errors.mainImage = t("errors.mainImage");
  }

  // Purchase options validation
  if (!allowDirectPurchase && !allowAddToCart) {
    errors.purchaseOptions = t("errors.purchaseOptions");
  }

  // Variants validation
  if (hasVariants) {
    if (variantOptions.some((o) => !o.name.ar.trim() || !o.name.fr.trim())) {
      errors.variants = t("errors.variants");
    }
    if (variantOptions.some((o) => o.values.length === 0)) {
      errors.variants = t("errors.variants");
    }
    if (variants.some((v) => v.price <= 0)) {
      errors.variants = t("errors.variants");
    }
  }

  // Custom sections validation
  if (hasCustomSections) {
    customSections.forEach((section, index) => {
      if (!section.nameAr.trim() || !section.nameFr.trim()) {
        errors[`customSection${index}`] = t("errors.customSection");
      }
      if (
        section.type === "description" &&
        (!section.descriptionAr.trim() || !section.descriptionFr.trim())
      ) {
        errors[`customSection${index}`] = t("errors.customSection");
      }
    });
  }

  return errors;
};

/**
 * Scrolls to and focuses the first error field
 */
export const scrollToFirstError = (errors: ValidationErrors): void => {
  const firstError = Object.keys(errors)[0];
  if (!firstError) return;

  let targetId = firstError;
  if (firstError === "variants") {
    targetId = "variants-list";
  } else if (firstError === "purchaseOptions") {
    targetId = "purchase-options";
  } else if (firstError.startsWith("customSection")) {
    targetId = "custom-sections";
  } else if (firstError === "mainImage") {
    targetId = "main-image";
  } else if (firstError === "categoryId") {
    targetId = "category";
  }

  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    if (
      element.tagName === "INPUT" ||
      element.tagName === "TEXTAREA" ||
      element.tagName === "SELECT"
    ) {
      element.focus();
    }
  }
};
