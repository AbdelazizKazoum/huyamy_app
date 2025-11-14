import { useState, useEffect, ChangeEvent } from "react";
import { Product, ProductVariant, VariantOption } from "@/types";
import { generateCombinations } from "../utils/productFormUtils";
import { PREDEFINED_OPTIONS } from "../constants/variantOptions";

/**
 * Custom hook for managing product variants
 */
export const useProductVariants = (
  product: Product | null,
  isOpen: boolean,
  hasVariants: boolean
) => {
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [optionValueInputs, setOptionValueInputs] = useState<{
    [key: number]: string;
  }>({});
  const [customOptionFlags, setCustomOptionFlags] = useState<{
    [key: number]: boolean;
  }>({});
  const [newVariantImages, setNewVariantImages] = useState<{
    [variantId: string]: File[];
  }>({});
  const [deletedVariantImageUrls, setDeletedVariantImageUrls] = useState<
    string[]
  >([]);

  // Initialize variant state from product or reset
  useEffect(() => {
    if (product) {
      setVariantOptions(product.variantOptions || []);
      const productVariants = (product.variants || []).map((v) => ({
        ...v,
        images: v.images || [],
      }));
      setVariants(productVariants);

      // Initialize custom flags for existing product
      const initialCustomFlags: { [key: number]: boolean } = {};
      (product.variantOptions || []).forEach((opt, index) => {
        const isPredefined = PREDEFINED_OPTIONS.some(
          (p) => p.fr === opt.name.fr && p.ar === opt.name.ar
        );
        if (!isPredefined) {
          initialCustomFlags[index] = true;
        }
      });
      setCustomOptionFlags(initialCustomFlags);
    } else {
      setVariantOptions([]);
      setVariants([]);
      setCustomOptionFlags({});
    }
  }, [product, isOpen]);

  // Auto-generate variants when options change
  useEffect(() => {
    if (!hasVariants) {
      setVariants([]);
      return;
    }

    const newCombinations = generateCombinations(variantOptions);
    setVariants((currentVariants) => {
      const sourceVariants =
        currentVariants && currentVariants.length > 0
          ? currentVariants
          : product && product.variants
          ? product.variants.map((v) => ({ ...v, images: v.images || [] }))
          : [];

      const newVariants = newCombinations.map((combo) => {
        const comboId = Object.values(combo).join("-");
        const existingVariant = sourceVariants.find(
          (v) =>
            Object.entries(v.options).every(
              ([key, value]) => combo[key] === value
            ) && Object.keys(v.options).length === Object.keys(combo).length
        );
        return {
          id: existingVariant?.id || comboId,
          price: existingVariant?.price ?? 0,
          originalPrice: existingVariant?.originalPrice ?? undefined,
          isActive: existingVariant?.isActive ?? true,
          images: existingVariant?.images || [],
          options: combo,
        };
      });
      return newVariants;
    });
  }, [variantOptions, hasVariants, product]);

  const addVariantOption = () => {
    setVariantOptions([
      ...variantOptions,
      { name: { ar: "", fr: "" }, values: [] },
    ]);
  };

  const removeVariantOption = (index: number) => {
    setVariantOptions(variantOptions.filter((_, i) => i !== index));
    const newFlags = { ...customOptionFlags };
    delete newFlags[index];
    setCustomOptionFlags(newFlags);
  };

  const handleOptionNameChange = (index: number, value: string) => {
    const newOptions = [...variantOptions];
    if (value === "custom") {
      setCustomOptionFlags({ ...customOptionFlags, [index]: true });
      newOptions[index].name = { ar: "", fr: "" };
    } else {
      setCustomOptionFlags({ ...customOptionFlags, [index]: false });
      const selectedOption = PREDEFINED_OPTIONS.find((p) => p.fr === value);
      if (selectedOption) {
        newOptions[index].name = {
          ar: selectedOption.ar,
          fr: selectedOption.fr,
        };
      }
    }
    setVariantOptions(newOptions);
  };

  const updateCustomOptionName = (
    index: number,
    lang: "ar" | "fr",
    name: string
  ) => {
    const newOptions = [...variantOptions];
    newOptions[index].name[lang] = name;
    setVariantOptions(newOptions);
  };

  const addOptionValue = (optionIndex: number) => {
    const value = optionValueInputs[optionIndex]?.trim();
    if (!value) return;

    const newOptions = [...variantOptions];
    if (!newOptions[optionIndex].values.includes(value)) {
      newOptions[optionIndex].values.push(value);
      setVariantOptions(newOptions);
    }
    setOptionValueInputs({ ...optionValueInputs, [optionIndex]: "" });
  };

  const removeOptionValue = (optionIndex: number, valueToRemove: string) => {
    const newOptions = [...variantOptions];
    newOptions[optionIndex].values = newOptions[optionIndex].values.filter(
      (v) => v !== valueToRemove
    );
    setVariantOptions(newOptions);
  };

  const updateVariantPrice = (
    variantId: string,
    field: "price" | "originalPrice" | "isActive",
    value: number | string | boolean
  ) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          if (field === "isActive") {
            return { ...v, [field]: Boolean(value) };
          }
          if (field === "originalPrice") {
            const numValue =
              value === "" ? undefined : Number(value) || undefined;
            return { ...v, [field]: numValue };
          } else {
            return { ...v, [field]: Number(value) || 0 };
          }
        }
        return v;
      })
    );
  };

  const handleVariantImagesChange = (
    e: ChangeEvent<HTMLInputElement>,
    variantId: string
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

      setVariants((prevVariants) =>
        prevVariants.map((v) =>
          v.id === variantId
            ? { ...v, images: [...(v.images || []), ...newPreviewUrls] }
            : v
        )
      );

      setNewVariantImages((prev) => {
        const existingFiles = prev[variantId] || [];
        return {
          ...prev,
          [variantId]: [...existingFiles, ...newFiles],
        };
      });
    }
  };

  const removeVariantImage = (variantId: string, imageUrlToRemove: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return;

    if (imageUrlToRemove.startsWith("blob:")) {
      const blobImages = (variant.images || []).filter((img) =>
        img.startsWith("blob:")
      );
      const blobIndexToRemove = blobImages.findIndex(
        (img) => img === imageUrlToRemove
      );

      if (blobIndexToRemove !== -1) {
        setNewVariantImages((prev) => {
          const variantFiles = prev[variantId] || [];
          const updatedFiles = variantFiles.filter(
            (_, i) => i !== blobIndexToRemove
          );
          return {
            ...prev,
            [variantId]: updatedFiles,
          };
        });
      }
    } else {
      setDeletedVariantImageUrls((prev) => [...prev, imageUrlToRemove]);
    }

    setVariants((prevVariants) =>
      prevVariants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              images: (v.images || []).filter(
                (img) => img !== imageUrlToRemove
              ),
            }
          : v
      )
    );
  };

  return {
    variantOptions,
    variants,
    optionValueInputs,
    setOptionValueInputs,
    customOptionFlags,
    newVariantImages,
    deletedVariantImageUrls,
    addVariantOption,
    removeVariantOption,
    handleOptionNameChange,
    updateCustomOptionName,
    addOptionValue,
    removeOptionValue,
    updateVariantPrice,
    handleVariantImagesChange,
    removeVariantImage,
  };
};
