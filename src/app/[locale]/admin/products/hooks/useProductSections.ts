import { useState, useEffect } from "react";
import { Product } from "@/types";

/**
 * Custom hook for managing product sections (related products and custom sections)
 */
export const useProductSections = (
  product: Product | null,
  isOpen: boolean
) => {
  const [hasRelatedProducts, setHasRelatedProducts] = useState(false);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    Product[]
  >([]);
  const [hasCustomSections, setHasCustomSections] = useState(false);
  const [customSections, setCustomSections] = useState<
    {
      nameAr: string;
      nameFr: string;
      type: "products" | "description";
      selectedProducts: Product[];
      descriptionAr: string;
      descriptionFr: string;
    }[]
  >([]);

  // Initialize sections from product or reset
  useEffect(() => {
    setHasRelatedProducts(false);
    setSelectedRelatedProducts([]);
    setHasCustomSections(false);
    setCustomSections([]);

    if (product) {
      if (
        product.relatedProducts &&
        product.relatedProducts.products.length > 0
      ) {
        setHasRelatedProducts(true);
        setSelectedRelatedProducts(product.relatedProducts.products);
      }
      if (product.customSections && product.customSections.length > 0) {
        setHasCustomSections(true);
        setCustomSections(
          product.customSections.map((section) => ({
            nameAr: section.name.ar || "",
            nameFr: section.name.fr || "",
            type: section.type,
            selectedProducts: section.products || [],
            descriptionAr: section.description?.ar || "",
            descriptionFr: section.description?.fr || "",
          }))
        );
      }
    }
  }, [product, isOpen]);

  const addRelatedProduct = (product: Product) => {
    if (!selectedRelatedProducts.some((p) => p.id === product.id)) {
      setSelectedRelatedProducts((prev) => [...prev, product]);
    }
  };

  const removeRelatedProduct = (productId: string) => {
    setSelectedRelatedProducts((prev) =>
      prev.filter((p) => p.id !== productId)
    );
  };

  const addCustomSection = () => {
    setCustomSections((prev) => [
      ...prev,
      {
        nameAr: "",
        nameFr: "",
        type: "products",
        selectedProducts: [],
        descriptionAr: "",
        descriptionFr: "",
      },
    ]);
  };

  const removeCustomSection = (index: number) => {
    setCustomSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCustomSection = (
    index: number,
    field: string,
    value: string | "products" | "description"
  ) => {
    setCustomSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    );
  };

  const addProductToSection = (sectionIndex: number, product: Product) => {
    setCustomSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              selectedProducts: section.selectedProducts.some(
                (p) => p.id === product.id
              )
                ? section.selectedProducts
                : [...section.selectedProducts, product],
            }
          : section
      )
    );
  };

  const removeProductFromSection = (
    sectionIndex: number,
    productId: string
  ) => {
    setCustomSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              selectedProducts: section.selectedProducts.filter(
                (p) => p.id !== productId
              ),
            }
          : section
      )
    );
  };

  return {
    hasRelatedProducts,
    setHasRelatedProducts,
    selectedRelatedProducts,
    hasCustomSections,
    setHasCustomSections,
    customSections,
    addRelatedProduct,
    removeRelatedProduct,
    addCustomSection,
    removeCustomSection,
    updateCustomSection,
    addProductToSection,
    removeProductFromSection,
  };
};
