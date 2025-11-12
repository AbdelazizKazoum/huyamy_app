"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Category,
  Language,
  Product,
  VariantOption,
  ProductVariant,
} from "@/types";
import { PlusCircle, Trash2, UploadCloud, X, Palette } from "lucide-react";
import Image from "next/image";
import FormInput from "@/components/admin/ui/FormInput";
import FormTextarea from "@/components/admin/ui/FormTextarea";
import CustomSelect from "@/components/admin/ui/CustomSelect";
import FormToggle from "@/components/admin/ui/FormToggle";
import SubmitButton from "@/components/admin/ui/SubmitButton";
import CancelButton from "@/components/admin/ui/CancelButton";
import ColorPickerModal from "@/components/admin/modals/ColorPickerModal";
import ProductSelector from "@/components/admin/ProductSelector";
import { useProductStore } from "@/store/useProductStore";
import { useTranslations } from "next-intl";

// --- Predefined list of common variant options with placeholders ---
const PREDEFINED_OPTIONS = [
  { ar: "الحجم", fr: "Taille", placeholder: "مثال: S, M, L, XL" },
  { ar: "اللون", fr: "Couleur", placeholder: "مثال: أحمر, أزرق, أخضر" },
  { ar: "الوزن", fr: "Poids", placeholder: "مثال: 1kg, 500g, 250g" },
  { ar: "المادة", fr: "Matériau", placeholder: "مثال: قطن, جلد, معدن" },
  { ar: "السعة", fr: "Capacité", placeholder: "مثال: 1L, 500ml, 2L" },
];

// --- Helper function to generate variant combinations ---
const generateCombinations = (
  options: VariantOption[]
): { [key: string]: string }[] => {
  if (options.length === 0 || options.some((o) => o.values.length === 0)) {
    return [];
  }

  let combinations: { [key: string]: string }[] = [{}];

  for (const option of options) {
    const newCombinations: { [key: string]: string }[] = [];
    for (const combination of combinations) {
      for (const value of option.values) {
        newCombinations.push({ ...combination, [option.name.fr]: value });
      }
    }
    combinations = newCombinations;
  }

  return combinations;
};

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: FormData) => void;
  product: Product | null;
  categories: Category[];
  lang: Language;
  isSubmitting?: boolean;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  lang,
  isSubmitting = false,
}) => {
  const t = useTranslations("admin.products.modal");

  // --- Existing State ---
  const [nameAr, setNameAr] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [originalPrice, setOriginalPrice] = useState<number | string>("");
  const [selectedCategoryJSON, setSelectedCategoryJSON] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [deletedSubImageUrls, setDeletedSubImageUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [allowDirectPurchase, setAllowDirectPurchase] = useState(true);
  const [allowAddToCart, setAllowAddToCart] = useState(true);
  const [certificationImages, setCertificationImages] = useState<File[]>([]);
  const [certificationImagePreviews, setCertificationImagePreviews] = useState<
    string[]
  >([]);
  const [deletedCertificationImageUrls, setDeletedCertificationImageUrls] =
    useState<string[]>([]);

  // --- Variant State ---
  const [hasVariants, setHasVariants] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [optionValueInputs, setOptionValueInputs] = useState<{
    [key: number]: string;
  }>({});
  const [customOptionFlags, setCustomOptionFlags] = useState<{
    [key: number]: boolean;
  }>({});

  // --- Color Picker State ---
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [currentColorPickerIndex, setCurrentColorPickerIndex] = useState<
    number | null
  >(null);
  const [pickerColor, setPickerColor] = useState("#ffffff");

  // --- MODIFIED: Per-Variant Image State ---
  const [newVariantImages, setNewVariantImages] = useState<{
    [variantId: string]: File[];
  }>({});
  const [deletedVariantImageUrls, setDeletedVariantImageUrls] = useState<
    string[]
  >([]);

  // --- NEW: Product Sections State ---
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
  // --- END NEW ---

  // --- NEW: Get products from store for filtering ---
  const { products: allProducts } = useProductStore();
  // --- END NEW ---

  // --- State Initialization Effect ---
  useEffect(() => {
    // --- NEW: Reset section state on modal open/product change ---
    setHasRelatedProducts(false);
    setSelectedRelatedProducts([]);
    setHasCustomSections(false);
    setCustomSections([]);
    // --- END NEW ---

    if (product) {
      setNameAr(product.name.ar);
      setNameFr(product.name.fr);
      setDescriptionAr(product.description.ar);
      setDescriptionFr(product.description.fr);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || "");
      setSelectedCategoryJSON(
        product.category ? JSON.stringify(product.category) : ""
      );
      setIsNew(product.isNew);
      setKeywords(product.keywords || []);
      setMainImage(null);
      setMainImagePreview(product.image);
      setSubImages([]);
      setSubImagePreviews(product.subImages || []);
      setDeletedSubImageUrls([]);
      setCertificationImages([]);
      setCertificationImagePreviews(product.certificationImages || []);
      setDeletedCertificationImageUrls([]);
      setAllowDirectPurchase(product.allowDirectPurchase ?? true);
      setAllowAddToCart(product.allowAddToCart ?? true);

      // Populate variant state
      const productHasVariants =
        !!product.variantOptions && product.variantOptions.length > 0;
      setHasVariants(productHasVariants);
      setVariantOptions(product.variantOptions || []);
      setVariants(
        (product.variants || []).map((v) => ({ ...v, images: v.images || [] }))
      );

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

      // --- NEW: Populate sections if product has them ---
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
      // --- END NEW ---
    } else {
      // Reset form for new product
      setNameAr("");
      setNameFr("");
      setDescriptionAr("");
      setDescriptionFr("");
      setPrice("");
      setOriginalPrice("");
      setSelectedCategoryJSON("");
      setIsNew(true);
      setKeywords([]);
      setKeywordsInput("");
      setMainImage(null);
      setMainImagePreview(null);
      setSubImages([]);
      setSubImagePreviews([]);
      setDeletedSubImageUrls([]);
      setCertificationImages([]);
      setCertificationImagePreviews([]);
      setDeletedCertificationImageUrls([]);
      setAllowDirectPurchase(true);
      setAllowAddToCart(true);

      // Reset variant state
      setHasVariants(false);
      setVariantOptions([]);
      setVariants([]);
      setCustomOptionFlags({});
    }
    setErrors({});
  }, [product, isOpen]);

  // --- Variant Generation Effect ---
  useEffect(() => {
    if (!hasVariants) return;

    const newCombinations = generateCombinations(variantOptions);
    const newVariants = newCombinations.map((combo) => {
      const comboId = Object.values(combo).join("-");
      const existingVariant = variants.find(
        (v) =>
          Object.entries(v.options).every(
            ([key, value]) => combo[key] === value
          ) && Object.keys(v.options).length === Object.keys(combo).length
      );
      return {
        id: existingVariant?.id || comboId,
        price: existingVariant?.price || 0,
        originalPrice: existingVariant?.originalPrice,
        images: existingVariant?.images || [],
        options: combo,
      };
    });
    setVariants(newVariants);
  }, [variantOptions, hasVariants]);

  // --- Variant UI Handlers ---
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
    field: "price" | "originalPrice",
    value: number | string
  ) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId ? { ...v, [field]: Number(value) || 0 } : v
      )
    );
  };

  // --- Color Picker Submit Handler ---
  const handleColorPickerSubmit = () => {
    if (currentColorPickerIndex === null) return;

    const value = pickerColor;
    const newOptions = [...variantOptions];

    if (!newOptions[currentColorPickerIndex].values.includes(value)) {
      newOptions[currentColorPickerIndex].values.push(value);
    }

    setIsColorPickerOpen(false);
    setCurrentColorPickerIndex(null);
  };

  // --- MODIFIED: Per-Variant Image Handlers ---
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

  // --- NEW: Product Section Handlers ---
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
  // --- END NEW ---

  // --- Existing Handlers ---
  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSubImages((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setSubImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleCertificationImagesChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCertificationImages((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setCertificationImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeSubImage = (index: number, previewUrl: string) => {
    if (previewUrl.startsWith("blob:")) {
      const fileIndexToRemove = subImagePreviews
        .slice(subImagePreviews.length - subImages.length)
        .findIndex((p) => p === previewUrl);

      if (fileIndexToRemove !== -1) {
        setSubImages((prev) => prev.filter((_, i) => i !== fileIndexToRemove));
      }
    } else {
      setDeletedSubImageUrls((prev) => [...prev, previewUrl]);
    }
    setSubImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeCertificationImage = (index: number, previewUrl: string) => {
    if (previewUrl.startsWith("blob:")) {
      const fileIndexToRemove = certificationImagePreviews
        .slice(certificationImagePreviews.length - certificationImages.length)
        .findIndex((p) => p === previewUrl);

      if (fileIndexToRemove !== -1) {
        setCertificationImages((prev) =>
          prev.filter((_, i) => i !== fileIndexToRemove)
        );
      }
    } else {
      setDeletedCertificationImageUrls((prev) => [...prev, previewUrl]);
    }

    setCertificationImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeywordsInput(e.target.value);
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const newKeyword = keywordsInput.trim();
      if (newKeyword && !keywords.includes(newKeyword)) {
        setKeywords([...keywords, newKeyword]);
      }
      setKeywordsInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!nameAr.trim()) newErrors.nameAr = t("errors.nameAr");
    if (!nameFr.trim()) newErrors.nameFr = t("errors.nameFr");
    if (!descriptionAr.trim())
      newErrors.descriptionAr = t("errors.descriptionAr");
    if (!descriptionFr.trim())
      newErrors.descriptionFr = t("errors.descriptionFr");
    if (!hasVariants && (!price || Number(price) <= 0))
      newErrors.price = t("errors.price");
    if (!selectedCategoryJSON) newErrors.categoryId = t("errors.category");
    if (!product && !mainImage) {
      newErrors.mainImage = t("errors.mainImage");
    }
    if (!allowDirectPurchase && !allowAddToCart) {
      newErrors.purchaseOptions = t("errors.purchaseOptions");
    }
    if (hasVariants) {
      if (variantOptions.some((o) => !o.name.ar.trim() || !o.name.fr.trim())) {
        newErrors.variants = t("errors.variants");
      }
      if (variantOptions.some((o) => o.values.length === 0)) {
        newErrors.variants = t("errors.variants");
      }
      if (variants.some((v) => v.price <= 0)) {
        newErrors.variants = t("errors.variants");
      }
    }
    if (hasCustomSections) {
      customSections.forEach((section, index) => {
        if (!section.nameAr.trim() || !section.nameFr.trim()) {
          newErrors[`customSection${index}`] = t("errors.customSection");
        }
        if (
          section.type === "description" &&
          (!section.descriptionAr.trim() || !section.descriptionFr.trim())
        ) {
          newErrors[`customSection${index}`] = t("errors.customSection");
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handle Form Submit ---
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) {
      return;
    }

    const selectedCategory = selectedCategoryJSON
      ? (JSON.parse(selectedCategoryJSON) as Category)
      : null;

    const cleanedVariants = hasVariants
      ? variants.map((v) => {
          const keptImages = (v.images || []).filter(
            (img) => !img.startsWith("blob:")
          );
          return { ...v, images: keptImages };
        })
      : [];

    const productData = {
      name: { ar: nameAr, fr: nameFr },
      description: { ar: descriptionAr, fr: descriptionFr },
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      categoryId: selectedCategory?.id || "",
      category: selectedCategory,
      isNew,
      keywords,
      allowDirectPurchase,
      allowAddToCart,
      variantOptions: hasVariants ? variantOptions : [],
      variants: cleanedVariants,
      relatedProducts: hasRelatedProducts
        ? {
            ids: selectedRelatedProducts.map((p) => p.id),
            products: selectedRelatedProducts,
          }
        : null,
      customSections: hasCustomSections
        ? customSections.map((section) => ({
            name: { ar: section.nameAr, fr: section.nameFr },
            type: section.type,
            ...(section.type === "products" && {
              ids: section.selectedProducts.map((p) => p.id),
              products: section.selectedProducts,
            }),
            ...(section.type === "description" && {
              description: {
                ar: section.descriptionAr,
                fr: section.descriptionFr,
              },
            }),
          }))
        : null,
    };

    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));

    if (deletedSubImageUrls.length > 0) {
      formData.append(
        "deletedSubImageUrls",
        JSON.stringify(deletedSubImageUrls)
      );
    }
    if (deletedCertificationImageUrls.length > 0) {
      formData.append(
        "deletedCertificationImageUrls",
        JSON.stringify(deletedCertificationImageUrls)
      );
    }
    if (deletedVariantImageUrls.length > 0) {
      formData.append(
        "deletedVariantImageUrls",
        JSON.stringify(deletedVariantImageUrls)
      );
    }

    if (product) {
      formData.append("id", product.id);
    }

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    subImages.forEach((file) => {
      formData.append("subImages", file);
    });
    certificationImages.forEach((file) => {
      formData.append("certificationImages", file);
    });

    Object.entries(newVariantImages).forEach(([variantId, files]) => {
      files.forEach((file) => {
        formData.append(variantId, file);
      });
    });

    // --- For Debugging ---
    console.log("--- Submitting Product Data (JSON) ---");
    console.log(JSON.parse(formData.get("productData") as string));

    console.log("--- Submitting Files ---");
    if (mainImage) {
      console.log(
        `mainImage: File { name: "${mainImage.name}", size: ${mainImage.size} }`
      );
    }
    subImages.forEach((file, index) => {
      console.log(
        `subImages[${index}]: File { name: "${file.name}", size: ${file.size} }`
      );
    });
    certificationImages.forEach((file, index) => {
      console.log(
        `certificationImages[${index}]: File { name: "${file.name}", size: ${file.size} }`
      );
    });
    Object.entries(newVariantImages).forEach(([variantId, files]) => {
      files.forEach((file, index) => {
        console.log(
          `variantImage[${variantId}][${index}]: File { name: "${file.name}", size: ${file.size} }`
        );
      });
    });
    console.log("--------------------------");

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const title = product ? t("editTitle") : t("addTitle");

  const availableProductsForSelectors = allProducts.filter(
    (p) =>
      (!product || p.id !== product.id) &&
      !selectedRelatedProducts.some((sp) => sp.id === p.id) &&
      !customSections.some((section) =>
        section.selectedProducts.some((sp) => sp.id === p.id)
      )
  );

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
        {/* --- Modal Header --- */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- Modal Body --- */}
        <div className="overflow-y-auto p-6 space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6">
            {/* --- Existing Form Fields --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <FormInput
                  label={t("labels.nameAr")}
                  id="nameAr"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  error={errors.nameAr}
                  required
                />
                <FormTextarea
                  label={t("labels.descriptionAr")}
                  id="descriptionAr"
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  rows={4}
                  error={errors.descriptionAr}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  {!hasVariants && (
                    <>
                      <FormInput
                        label={t("labels.price")}
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        error={errors.price}
                        required
                      />
                      <FormInput
                        label={t("labels.originalPrice")}
                        id="originalPrice"
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                      />
                    </>
                  )}
                  {hasVariants && (
                    <>
                      <CustomSelect
                        label={t("labels.category")}
                        value={selectedCategoryJSON}
                        onChange={(value) => setSelectedCategoryJSON(value)}
                        error={errors.categoryId}
                      >
                        <option value="" disabled>
                          {t("placeholders.selectCategory")}
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={JSON.stringify(cat)}>
                            {cat.name[lang]}
                          </option>
                        ))}
                      </CustomSelect>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("labels.keywords")}
                        </label>
                        <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-green-700">
                          {keywords.map((kw, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1.5 bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full"
                            >
                              {kw}
                              <button
                                type="button"
                                onClick={() => removeKeyword(kw)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          <input
                            type="text"
                            value={keywordsInput}
                            onChange={handleKeywordsChange}
                            onKeyDown={handleKeywordKeyDown}
                            className="flex-grow bg-transparent focus:outline-none"
                            placeholder={t("placeholders.addKeyword")}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {!hasVariants && (
                  <CustomSelect
                    label={t("labels.category")}
                    value={selectedCategoryJSON}
                    onChange={(value) => setSelectedCategoryJSON(value)}
                    error={errors.categoryId}
                  >
                    <option value="" disabled>
                      {t("placeholders.selectCategory")}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={JSON.stringify(cat)}>
                        {cat.name[lang]}
                      </option>
                    ))}
                  </CustomSelect>
                )}
                <FormToggle
                  label={t("labels.isNew")}
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.purchaseOptions")}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormToggle
                      label={t("labels.directPurchase")}
                      checked={allowDirectPurchase}
                      onChange={(e) => setAllowDirectPurchase(e.target.checked)}
                    />
                    <FormToggle
                      label={t("labels.addToCart")}
                      checked={allowAddToCart}
                      onChange={(e) => setAllowAddToCart(e.target.checked)}
                    />
                  </div>
                  {errors.purchaseOptions && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.purchaseOptions}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <FormInput
                  label={t("labels.nameFr")}
                  id="nameFr"
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  error={errors.nameFr}
                  required
                />
                <FormTextarea
                  label={t("labels.descriptionFr")}
                  id="descriptionFr"
                  value={descriptionFr}
                  onChange={(e) => setDescriptionFr(e.target.value)}
                  rows={4}
                  error={errors.descriptionFr}
                  required
                />
                {/* Only show keywords field here if not variants */}
                {!hasVariants && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("labels.keywords")}
                    </label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-green-700">
                      {keywords.map((kw, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1.5 bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full"
                        >
                          {kw}
                          <button
                            type="button"
                            onClick={() => removeKeyword(kw)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        value={keywordsInput}
                        onChange={handleKeywordsChange}
                        onKeyDown={handleKeywordKeyDown}
                        className="flex-grow bg-transparent focus:outline-none"
                        placeholder={t("placeholders.addKeyword")}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- Variants Section --- */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <FormToggle
                label={t("labels.hasVariants")}
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
              />
              {hasVariants && (
                <div className="p-5 border border-slate-200 rounded-lg bg-slate-50 space-y-8">
                  {/* 1. Variant Options Definition */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("labels.variantOptions")}
                    </h3>
                    {variantOptions.map((option, index) => {
                      const predefined = PREDEFINED_OPTIONS.find(
                        (p) => p.fr === option.name.fr
                      );
                      const isColorOption =
                        option.name.fr.toLowerCase() === "couleur";
                      const placeholderText =
                        predefined?.placeholder || t("placeholders.enterValue");

                      return (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm transition-all hover:border-green-300"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-grow space-y-4">
                              <CustomSelect
                                label={`${t("labels.selectOption")} ${
                                  index + 1
                                }`}
                                value={
                                  customOptionFlags[index]
                                    ? "custom"
                                    : option.name.fr || ""
                                }
                                onChange={(value) =>
                                  handleOptionNameChange(index, value)
                                }
                              >
                                <option value="" disabled>
                                  -- {t("labels.selectOption")} --
                                </option>
                                {PREDEFINED_OPTIONS.map((opt) => (
                                  <option key={opt.fr} value={opt.fr}>
                                    {opt.ar} / {opt.fr}
                                  </option>
                                ))}
                                <option value="custom">
                                  {t("labels.customOptionAr")} /{" "}
                                  {t("labels.customOptionFr")}
                                </option>
                              </CustomSelect>

                              {customOptionFlags[index] && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-green-50/50 rounded-md border border-green-200">
                                  <FormInput
                                    label={t("labels.customOptionAr")}
                                    value={option.name.ar}
                                    onChange={(e) =>
                                      updateCustomOptionName(
                                        index,
                                        "ar",
                                        e.target.value
                                      )
                                    }
                                    placeholder={t(
                                      "placeholders.customOptionAr"
                                    )}
                                  />
                                  <FormInput
                                    label={t("labels.customOptionFr")}
                                    value={option.name.fr}
                                    onChange={(e) =>
                                      updateCustomOptionName(
                                        index,
                                        "fr",
                                        e.target.value
                                      )
                                    }
                                    placeholder={t(
                                      "placeholders.customOptionFr"
                                    )}
                                  />
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => removeVariantOption(index)}
                              className="mt-7 p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                              aria-label="Remove option"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("labels.optionValues")}
                          </label>
                          {/* --- Conditional render for Color Input --- */}
                          {isColorOption ? (
                            <div className="flex items-center gap-2">
                              {/* Input field wrapper */}
                              <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-green-600 focus-within:border-green-600 flex-grow">
                                {option.values.map((val, vIndex) => (
                                  <div
                                    key={vIndex}
                                    className="flex items-center gap-1.5 bg-sky-100 text-sky-800 text-sm font-medium pl-1.5 pr-2.5 py-1 rounded-full"
                                  >
                                    <span
                                      className="block w-3 h-3 rounded-full border border-gray-400"
                                      style={{ backgroundColor: val }}
                                    ></span>
                                    {val}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeOptionValue(index, val)
                                      }
                                      className="text-sky-600 hover:text-sky-900"
                                      aria-label={`Remove ${val}`}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                                <input
                                  type="text"
                                  value={optionValueInputs[index] || ""}
                                  onChange={(e) =>
                                    setOptionValueInputs({
                                      ...optionValueInputs,
                                      [index]: e.target.value,
                                    })
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addOptionValue(index);
                                    }
                                  }}
                                  className="flex-grow bg-transparent focus:outline-none min-w-[120px]"
                                  placeholder={t("placeholders.enterColor")}
                                />
                              </div>
                              {/* Color Picker Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentColorPickerIndex(index);
                                  const currentColor = optionValueInputs[index];
                                  setPickerColor(currentColor || "#ffffff");
                                  setIsColorPickerOpen(true);
                                }}
                                className="p-2.5 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
                                aria-label="Open color picker"
                              >
                                <Palette size={20} />
                              </button>
                            </div>
                          ) : (
                            // --- ELSE: Render the original input ---
                            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-green-600 focus-within:border-green-600">
                              {option.values.map((val, vIndex) => (
                                <div
                                  key={vIndex}
                                  className="flex items-center gap-1.5 bg-sky-100 text-sky-800 text-sm font-medium px-2.5 py-1 rounded-full"
                                >
                                  {val}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeOptionValue(index, val)
                                    }
                                    className="text-sky-600 hover:text-sky-900"
                                    aria-label={`Remove ${val}`}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                              <input
                                type="text"
                                value={optionValueInputs[index] || ""}
                                onChange={(e) =>
                                  setOptionValueInputs({
                                    ...optionValueInputs,
                                    [index]: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addOptionValue(index);
                                  }
                                }}
                                className="flex-grow bg-transparent focus:outline-none min-w-[120px]"
                                placeholder={placeholderText}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={addVariantOption}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-sky-300 rounded-lg text-sm font-semibold text-sky-600 hover:bg-sky-50 hover:border-sky-400 transition-all"
                    >
                      <PlusCircle size={18} />
                      {t("labels.addOption")}
                    </button>
                  </div>

                  {/* 2. Generated Variants Table */}
                  {variants.length > 0 && (
                    <div className="pt-8 border-t border-slate-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {t("labels.variantsList")}
                      </h3>
                      <div className="flow-root">
                        <div className="-mx-1 -my-2 overflow-x-auto">
                          <div className="inline-block min-w-full py-2 align-middle">
                            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                              {variants.map((variant, index) => (
                                <div
                                  key={variant.id}
                                  className={`p-4 ${
                                    index % 2 !== 0 ? "bg-slate-50" : ""
                                  }`}
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                                    <div className="font-medium text-slate-800 pt-2">
                                      {Object.values(variant.options).join(
                                        " / "
                                      )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <FormInput
                                        label={t("labels.variantPrice")}
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) =>
                                          updateVariantPrice(
                                            variant.id,
                                            "price",
                                            e.target.value
                                          )
                                        }
                                        placeholder={t("placeholders.price")}
                                      />
                                      <FormInput
                                        label={t("labels.variantOriginalPrice")}
                                        type="number"
                                        value={variant.originalPrice || ""}
                                        onChange={(e) =>
                                          updateVariantPrice(
                                            variant.id,
                                            "originalPrice",
                                            e.target.value
                                          )
                                        }
                                        placeholder={t("placeholders.price")}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("labels.variantImages")}
                                      </label>
                                      <div className="grid grid-cols-3 gap-2">
                                        {(variant.images || []).map(
                                          (src, imgIndex) => (
                                            <div
                                              key={imgIndex}
                                              className="relative group"
                                            >
                                              <Image
                                                src={src}
                                                alt={`variant ${index} image ${imgIndex}`}
                                                width={100}
                                                height={100}
                                                className="h-20 w-full object-cover rounded-md"
                                              />
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  removeVariantImage(
                                                    variant.id,
                                                    src
                                                  );
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <X size={12} />
                                              </button>
                                            </div>
                                          )
                                        )}
                                        <label
                                          htmlFor={`variant-images-upload-${variant.id}`}
                                          className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                                        >
                                          <PlusCircle
                                            size={20}
                                            className="text-gray-400"
                                          />
                                          <span className="text-xs text-gray-500 mt-1">
                                            {t("labels.addImage")}
                                          </span>
                                          <input
                                            id={`variant-images-upload-${variant.id}`}
                                            type="file"
                                            multiple
                                            className="sr-only"
                                            onChange={(e) =>
                                              handleVariantImagesChange(
                                                e,
                                                variant.id
                                              )
                                            }
                                            accept="image/*"
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {errors.variants && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.variants}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* --- NEW: Product Sections --- */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              {/* Related Products Section */}
              <div className="space-y-4">
                <FormToggle
                  label={t("labels.hasRelatedProducts")}
                  checked={hasRelatedProducts}
                  onChange={(e) => setHasRelatedProducts(e.target.checked)}
                />
                {hasRelatedProducts && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      {t("labels.relatedProducts")}
                    </h4>
                    <ProductSelector
                      availableProducts={availableProductsForSelectors}
                      onProductSelect={addRelatedProduct}
                      lang={lang}
                      label={t("labels.selectRelatedProducts")}
                    />
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedRelatedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="relative border border-gray-200 bg-white rounded-lg p-2 flex flex-col items-center text-center shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => removeRelatedProduct(p.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                          >
                            <X size={14} />
                          </button>
                          <Image
                            src={p.image}
                            alt={p.name[lang]}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <span className="mt-2 text-xs font-medium text-gray-700">
                            {p.name[lang]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Sections */}
              <div className="space-y-4">
                <FormToggle
                  label={t("labels.hasCustomSections")}
                  checked={hasCustomSections}
                  onChange={(e) => setHasCustomSections(e.target.checked)}
                />
                {hasCustomSections && (
                  <div className="space-y-4">
                    {customSections.map((section, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {t("labels.customSection")} {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeCustomSection(index)}
                            className="p-2 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                            aria-label="Remove section"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormInput
                            label={t("labels.sectionNameAr")}
                            value={section.nameAr}
                            onChange={(e) =>
                              updateCustomSection(
                                index,
                                "nameAr",
                                e.target.value
                              )
                            }
                            error={errors[`customSection${index}`]}
                            required
                          />
                          <FormInput
                            label={t("labels.sectionNameFr")}
                            value={section.nameFr}
                            onChange={(e) =>
                              updateCustomSection(
                                index,
                                "nameFr",
                                e.target.value
                              )
                            }
                            error={errors[`customSection${index}`]}
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <CustomSelect
                            label={t("labels.sectionType")}
                            value={section.type}
                            onChange={(value) =>
                              updateCustomSection(
                                index,
                                "type",
                                value as "products" | "description"
                              )
                            }
                          >
                            <option value="products">
                              {t("labels.sectionProducts")}
                            </option>
                            <option value="description">
                              {t("labels.sectionDescription")}
                            </option>
                          </CustomSelect>
                        </div>
                        {section.type === "products" && (
                          <>
                            <ProductSelector
                              availableProducts={availableProductsForSelectors}
                              onProductSelect={(product) =>
                                addProductToSection(index, product)
                              }
                              lang={lang}
                              label={t("labels.selectSectionProducts")}
                            />
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                              {section.selectedProducts.map((p) => (
                                <div
                                  key={p.id}
                                  className="relative border border-gray-200 bg-white rounded-lg p-3 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeProductFromSection(index, p.id)
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                  <Image
                                    src={p.image}
                                    alt={p.name[lang]}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 object-cover rounded-md mb-2"
                                  />
                                  <span className="text-xs font-medium text-gray-700">
                                    {p.name[lang]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        {section.type === "description" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormTextarea
                              label={t("labels.sectionDescriptionAr")}
                              value={section.descriptionAr}
                              onChange={(e) =>
                                updateCustomSection(
                                  index,
                                  "descriptionAr",
                                  e.target.value
                                )
                              }
                              rows={4}
                              error={errors[`customSection${index}`]}
                              required
                            />
                            <FormTextarea
                              label={t("labels.sectionDescriptionFr")}
                              value={section.descriptionFr}
                              onChange={(e) =>
                                updateCustomSection(
                                  index,
                                  "descriptionFr",
                                  e.target.value
                                )
                              }
                              rows={4}
                              error={errors[`customSection${index}`]}
                              required
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addCustomSection}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-green-300 rounded-lg text-sm font-semibold text-green-600 hover:bg-green-50 hover:border-green-400 transition-all"
                    >
                      <PlusCircle size={18} />
                      {t("labels.addCustomSection")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* --- Image Uploads Section --- */}
            <div className="space-y-8 pt-6 border-t border-gray-200">
              {/* Row 1: Main and Sub Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.mainImage")}
                  </label>
                  <div
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                      errors.mainImage ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <div className="space-y-1 text-center">
                      {mainImagePreview ? (
                        <Image
                          src={mainImagePreview}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="mx-auto h-32 w-32 object-cover rounded-md"
                        />
                      ) : (
                        <UploadCloud
                          className="mx-auto h-12 w-12 text-gray-400"
                          strokeWidth={1}
                        />
                      )}
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="main-image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                        >
                          <span>
                            {product
                              ? t("labels.changeImage")
                              : t("labels.uploadImage")}
                          </span>
                          <input
                            id="main-image-upload"
                            name="main-image-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleMainImageChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        {t("messages.imageFormat")}
                      </p>
                    </div>
                  </div>
                  {errors.mainImage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.mainImage}
                    </p>
                  )}
                </div>

                {/* Sub Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.subImages")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {subImagePreviews.map((src, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={src}
                          alt={`sub-image ${index}`}
                          width={100}
                          height={100}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubImage(index, src)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label
                      htmlFor="sub-images-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <PlusCircle size={24} className="text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">
                        {t("labels.addImage")}
                      </span>
                      <input
                        id="sub-images-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleSubImagesChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 2: Certification Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.certificationImages")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {certificationImagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={src}
                        alt={`certification-image ${index}`}
                        width={100}
                        height={100}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeCertificationImage(index, src)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="certification-images-upload"
                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <PlusCircle size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">
                      {t("labels.addImage")}
                    </span>
                    <input
                      id="certification-images-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleCertificationImagesChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* --- Modal Footer --- */}
        <div className="flex justify-end items-center gap-4 p-4 border-t border-neutral-200 bg-gray-50 rounded-b-lg">
          <CancelButton onClick={onClose} isSubmitting={isSubmitting}>
            {t("buttons.cancel")}
          </CancelButton>
          <SubmitButton isSubmitting={isSubmitting}>
            <span>{product ? t("buttons.save") : t("buttons.create")}</span>
          </SubmitButton>
        </div>
      </form>

      {/* --- Color Picker Modal --- */}
      <ColorPickerModal
        isOpen={isColorPickerOpen}
        color={pickerColor}
        onChange={setPickerColor}
        onCancel={() => setIsColorPickerOpen(false)}
        onSubmit={handleColorPickerSubmit}
      />
    </div>
  );
};

export default ProductFormModal;
