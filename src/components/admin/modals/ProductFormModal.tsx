"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Category,
  Language,
  Product,
  VariantOption,
  ProductVariant, // Make sure this type in @/types is updated to have images: string[]
} from "@/types";
import { PlusCircle, Trash2, UploadCloud, X, Palette } from "lucide-react";
import Image from "next/image";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";
import CustomSelect from "../ui/CustomSelect";
import FormToggle from "../ui/FormToggle";
import SubmitButton from "../ui/SubmitButton";
import CancelButton from "../ui/CancelButton";
import ColorPickerModal from "./ColorPickerModal";
import ProductSelector from "../ProductSelector"; // Import the ProductSelector
import { useProductStore } from "@/store/useProductStore"; // Import the store

// --- Predefined list of common variant options with placeholders ---
const PREDEFINED_OPTIONS = [
  // ... (no changes)
  { ar: "الحجم", fr: "Taille", placeholder: "مثال: S, M, L, XL" },
  { ar: "اللون", fr: "Couleur", placeholder: "مثال: أحمر, أزرق, أخضر" },
  { ar: "الوزن", fr: "Poids", placeholder: "مثال: 1kg, 500g, 250g" },
  { ar: "المادة", fr: "Matériau", placeholder: "مثال: قطن, جلد, معدن" },
  { ar: "السعة", fr: "Capacité", placeholder: "مثال: 1L, 500ml, 2L" },
];

// --- Helper function to generate variant combinations ---
const generateCombinations = (
  // ... (no changes)
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
  // ... (no changes)
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
  // --- Existing State ---
  // ... (all other state is unchanged)
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
  // ... (no changes)
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
  // ... (no changes)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [currentColorPickerIndex, setCurrentColorPickerIndex] = useState<
    number | null
  >(null);
  const [pickerColor, setPickerColor] = useState("#ffffff");

  // --- MODIFIED: Per-Variant Image State ---
  /**
   * Stores new File objects for variant images, keyed by variant.id
   * e.g., { 'variant-id-123': [File1, File2] }
   */
  const [newVariantImages, setNewVariantImages] = useState<{
    [variantId: string]: File[];
  }>({});
  /**
   * Stores existing image URLs to be deleted, e.g., ['http://.../img1.jpg']
   */
  const [deletedVariantImageUrls, setDeletedVariantImageUrls] = useState<
    string[]
  >([]);
  // --- END MODIFIED ---

  // --- NEW: Product Sections State ---
  const [hasRelatedProducts, setHasRelatedProducts] = useState(false);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    Product[]
  >([]);
  const [hasCustomSection, setHasCustomSection] = useState(false);
  const [customSectionNameAr, setCustomSectionNameAr] = useState("");
  const [customSectionNameFr, setCustomSectionNameFr] = useState("");
  const [selectedCustomProducts, setSelectedCustomProducts] = useState<
    Product[]
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
    setHasCustomSection(false);
    setCustomSectionNameAr("");
    setCustomSectionNameFr("");
    setSelectedCustomProducts([]);
    // --- END NEW ---

    if (product) {
      // ... (all other population is unchanged)
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
      // --- MODIFIED: Ensure images is always an array ---
      setVariants(
        (product.variants || []).map((v) => ({ ...v, images: v.images || [] }))
      );
      // --- END MODIFIED ---

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
      if (product.customSection) {
        setHasCustomSection(true);
        setCustomSectionNameAr(product.customSection.name.ar || "");
        setCustomSectionNameFr(product.customSection.name.fr || "");
        setSelectedCustomProducts(product.customSection.products || []);
      }
      // --- END NEW ---
    } else {
      // Reset form for new product
      // ... (all other reset is unchanged)
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
      // Try to find an existing variant to preserve its price/image
      const existingVariant = variants.find(
        (v) =>
          Object.entries(v.options).every(
            ([key, value]) => combo[key] === value
          ) && Object.keys(v.options).length === Object.keys(combo).length
      );
      return {
        id: existingVariant?.id || comboId, // IMPORTANT: Preserves existing ID
        price: existingVariant?.price || 0,
        originalPrice: existingVariant?.originalPrice,
        // --- MODIFIED: Use images array ---
        images: existingVariant?.images || [], // This preserves the existing images array
        // --- END MODIFIED ---
        options: combo,
      };
    });
    setVariants(newVariants);
  }, [variantOptions, hasVariants]); // Note: 'variants' is NOT in dependency array

  // --- Variant UI Handlers ---
  // ... (all other handlers are unchanged)
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
  // ... (no changes)
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

  // --- MODIFIED: Per-Variant Image Handlers (Plural) ---
  const handleVariantImagesChange = (
    e: ChangeEvent<HTMLInputElement>,
    variantId: string
  ) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

      // Update the variant's images preview array
      setVariants((prevVariants) =>
        prevVariants.map((v) =>
          v.id === variantId
            ? { ...v, images: [...(v.images || []), ...newPreviewUrls] }
            : v
        )
      );

      // Store the new file objects, mapped by variantId
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
      // It's a new file. We need to find its index among the *blobs*
      // to remove the correct File object from newVariantImages.

      // Get all blob URLs for *this variant* in their current order
      const blobImages = (variant.images || []).filter((img) =>
        img.startsWith("blob:")
      );
      // Find the specific index of the blob we're removing
      const blobIndexToRemove = blobImages.findIndex(
        (img) => img === imageUrlToRemove
      );

      if (blobIndexToRemove !== -1) {
        setNewVariantImages((prev) => {
          const variantFiles = prev[variantId] || [];
          // Remove the file at that specific index
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
      // It's an existing image (http:), mark it for deletion
      setDeletedVariantImageUrls((prev) => [...prev, imageUrlToRemove]);
    }

    // In either case, remove the preview from the 'variants' state
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
  // --- END MODIFIED ---

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

  const addCustomProduct = (product: Product) => {
    if (!selectedCustomProducts.some((p) => p.id === product.id)) {
      setSelectedCustomProducts((prev) => [...prev, product]);
    }
  };

  const removeCustomProduct = (productId: string) => {
    setSelectedCustomProducts((prev) => prev.filter((p) => p.id !== productId));
  };
  // --- END NEW ---

  // --- Existing Handlers (handleMainImageChange, etc.) ---
  // ... (all other handlers are unchanged)
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
    // ... (no changes)
    const newErrors: Partial<Record<string, string>> = {};

    if (!nameAr.trim()) newErrors.nameAr = "اسم المنتج بالعربية مطلوب.";
    if (!nameFr.trim()) newErrors.nameFr = "اسم المنتج بالفرنسية مطلوب.";
    if (!descriptionAr.trim())
      newErrors.descriptionAr = "وصف المنتج بالعربية مطلوب.";
    if (!descriptionFr.trim())
      newErrors.descriptionFr = "وصف المنتج بالفرنسية مطلوب.";
    if (!hasVariants && (!price || Number(price) <= 0))
      newErrors.price = "السعر يجب أن يكون رقمًا موجبًا.";
    if (!selectedCategoryJSON) newErrors.categoryId = "يجب اختيار فئة.";
    if (!product && !mainImage) {
      newErrors.mainImage = "الصورة الرئيسية مطلوبة لمنتج جديد.";
    }
    if (!allowDirectPurchase && !allowAddToCart) {
      newErrors.purchaseOptions = "يجب تفعيل خيار شراء واحد على الأقل.";
    }
    if (hasVariants) {
      if (variantOptions.some((o) => !o.name.ar.trim() || !o.name.fr.trim())) {
        newErrors.variants = "يجب تسمية جميع خيارات المنتج باللغتين.";
      }
      if (variantOptions.some((o) => o.values.length === 0)) {
        newErrors.variants = "يجب أن يحتوي كل خيار على قيمة واحدة على الأقل.";
      }
      if (variants.some((v) => v.price <= 0)) {
        newErrors.variants = "يجب أن يكون سعر كل متغير أكبر من صفر.";
      }
    }
    // --- NEW: Validate custom section ---
    if (
      hasCustomSection &&
      (!customSectionNameAr.trim() || !customSectionNameFr.trim())
    ) {
      newErrors.customSection = "يجب تسمية القسم المخصص باللغتين.";
    }
    // --- END NEW ---

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

    // --- MODIFIED: Clean variants array for submission ---
    const cleanedVariants = hasVariants
      ? variants.map((v) => {
          // Filter out blob: URLs, keep existing http: URLs
          const keptImages = (v.images || []).filter(
            (img) => !img.startsWith("blob:")
          );
          return { ...v, images: keptImages };
        })
      : [];
    // --- END MODIFIED ---

    const productData = {
      // ... (other data is unchanged)
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
      variants: cleanedVariants, // --- USE CLEANED VARIANTS ---
      // --- NEW: Add sections data ---
      relatedProducts: hasRelatedProducts
        ? {
            ids: selectedRelatedProducts.map((p) => p.id),
            products: selectedRelatedProducts,
          }
        : null,
      customSection: hasCustomSection
        ? {
            name: { ar: customSectionNameAr, fr: customSectionNameFr },
            ids: selectedCustomProducts.map((p) => p.id),
            products: selectedCustomProducts,
          }
        : null,
      // --- END NEW ---
    };

    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));

    // Append deleted image URLs for the backend to process
    if (deletedSubImageUrls.length > 0) {
      // ... (no changes)
      formData.append(
        "deletedSubImageUrls",
        JSON.stringify(deletedSubImageUrls)
      );
    }
    if (deletedCertificationImageUrls.length > 0) {
      // ... (no changes)
      formData.append(
        "deletedCertificationImageUrls",
        JSON.stringify(deletedCertificationImageUrls)
      );
    }
    // --- MODIFIED: Append Deleted Variant Image URLs ---
    if (deletedVariantImageUrls.length > 0) {
      formData.append(
        "deletedVariantImageUrls",
        JSON.stringify(deletedVariantImageUrls)
      );
    }
    // --- END MODIFIED ---

    // Append product ID for updates
    if (product) {
      // ... (no changes)
      formData.append("id", product.id);
    }

    // Append image files
    if (mainImage) {
      // ... (no changes)
      formData.append("mainImage", mainImage);
    }
    subImages.forEach((file) => {
      // ... (no changes)
      formData.append("subImages", file);
    });
    certificationImages.forEach((file) => {
      // ... (no changes)
      formData.append("certificationImages", file);
    });

    // --- MODIFIED: Append Variant Images ---
    // The backend will receive an array of files for each 'variantId' key
    Object.entries(newVariantImages).forEach(([variantId, files]) => {
      files.forEach((file) => {
        formData.append(variantId, file);
      });
    });
    // --- END MODIFIED ---

    // --- For Debugging ---
    console.log("--- Submitting Product Data (JSON) ---");
    console.log(JSON.parse(formData.get("productData") as string));

    console.log("--- Submitting Files ---");
    if (mainImage) {
      // ... (no changes)
      console.log(
        `mainImage: File { name: "${mainImage.name}", size: ${mainImage.size} }`
      );
    }
    subImages.forEach((file, index) => {
      // ... (no changes)
      console.log(
        `subImages[${index}]: File { name: "${file.name}", size: ${file.size} }`
      );
    });
    certificationImages.forEach((file, index) => {
      // ... (no changes)
      console.log(
        `certificationImages[${index}]: File { name: "${file.name}", size: ${file.size} }`
      );
    });
    // --- MODIFIED: Log variant files ---
    Object.entries(newVariantImages).forEach(([variantId, files]) => {
      files.forEach((file, index) => {
        console.log(
          `variantImage[${variantId}][${index}]: File { name: "${file.name}", size: ${file.size} }`
        );
      });
    });
    // --- END MODIFIED ---
    console.log("--------------------------");

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const title = product ? "تعديل المنتج" : "إضافة منتج جديد";

  // --- NEW: Filtered available products for selectors ---
  const availableProductsForSelectors = allProducts.filter(
    (p) =>
      (!product || p.id !== product.id) && // Exclude current product if editing
      !selectedRelatedProducts.some((sp) => sp.id === p.id) &&
      !selectedCustomProducts.some((sp) => sp.id === p.id)
  );
  // --- END NEW ---

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
        {/* --- Modal Header --- */}
        {/* ... (no changes) */}
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
            {/* ... (no changes to this section) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <FormInput
                  label="اسم المنتج (بالعربية)"
                  id="nameAr"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  error={errors.nameAr}
                  required
                />
                <FormTextarea
                  label="وصف المنتج (بالعربية)"
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
                        label="السعر الأساسي (د.م.)"
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        error={errors.price}
                        required
                      />
                      <FormInput
                        label="السعر الأصلي (اختياري)"
                        id="originalPrice"
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                      />
                    </>
                  )}
                  {hasVariants && (
                    <>
                      {/* When variants, show category and keywords side by side */}
                      <CustomSelect
                        label="الفئة"
                        value={selectedCategoryJSON}
                        onChange={(value) => setSelectedCategoryJSON(value)}
                        error={errors.categoryId}
                      >
                        <option value="" disabled>
                          -- اختر فئة --
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={JSON.stringify(cat)}>
                            {cat.name[lang]}
                          </option>
                        ))}
                      </CustomSelect>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الكلمات المفتاحية (افصل بينها بفاصلة ,)
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
                            placeholder="أضف كلمة مفتاحية..."
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {!hasVariants && (
                  <CustomSelect
                    label="الفئة"
                    value={selectedCategoryJSON}
                    onChange={(value) => setSelectedCategoryJSON(value)}
                    error={errors.categoryId}
                  >
                    <option value="" disabled>
                      -- اختر فئة --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={JSON.stringify(cat)}>
                        {cat.name[lang]}
                      </option>
                    ))}
                  </CustomSelect>
                )}
                <FormToggle
                  label="منتج جديد؟"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خيارات الشراء المتاحة
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormToggle
                      label="الطلب المباشر"
                      checked={allowDirectPurchase}
                      onChange={(e) => setAllowDirectPurchase(e.target.checked)}
                    />
                    <FormToggle
                      label="الإضافة للسلة"
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
                  label="Nom du produit (Français)"
                  id="nameFr"
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  error={errors.nameFr}
                  required
                />
                <FormTextarea
                  label="Description du produit (Français)"
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
                      الكلمات المفتاحية (افصل بينها بفاصلة ,)
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
                        placeholder="أضف كلمة مفتاحية..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- Variants Section --- */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <FormToggle
                label="هذا المنتج له متغيرات (مثل الحجم، الوزن، اللون)"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
              />
              {hasVariants && (
                <div className="p-5 border border-slate-200 rounded-lg bg-slate-50 space-y-8">
                  {/* 1. Variant Options Definition */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      خيارات المنتج
                    </h3>
                    {variantOptions.map((option, index) => {
                      const predefined = PREDEFINED_OPTIONS.find(
                        (p) => p.fr === option.name.fr
                      );
                      const isColorOption =
                        option.name.fr.toLowerCase() === "couleur";
                      const placeholderText =
                        predefined?.placeholder || "أضف قيمة واضغط Enter";

                      return (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm transition-all hover:border-green-300"
                        >
                          {/* ... (Select Option dropdown and Custom Option inputs) */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-grow space-y-4">
                              <CustomSelect
                                label={`اختر الخيار ${index + 1}`}
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
                                  -- اختر --
                                </option>
                                {PREDEFINED_OPTIONS.map((opt) => (
                                  <option key={opt.fr} value={opt.fr}>
                                    {opt.ar} / {opt.fr}
                                  </option>
                                ))}
                                <option value="custom">
                                  خيار مخصص / Autre...
                                </option>
                              </CustomSelect>

                              {customOptionFlags[index] && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-green-50/50 rounded-md border border-green-200">
                                  <FormInput
                                    label="الاسم المخصص (AR)"
                                    value={option.name.ar}
                                    onChange={(e) =>
                                      updateCustomOptionName(
                                        index,
                                        "ar",
                                        e.target.value
                                      )
                                    }
                                    placeholder="مثال: الضمان"
                                  />
                                  <FormInput
                                    label="Nom Personnalisé (FR)"
                                    value={option.name.fr}
                                    onChange={(e) =>
                                      updateCustomOptionName(
                                        index,
                                        "fr",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: Garantie"
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
                            قيم الخيار (اضغط Enter للإضافة)
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
                                  placeholder="أدخل لون (اسم أو #hex)"
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
                      إضافة خيار جديد
                    </button>
                  </div>

                  {/* 2. Generated Variants Table */}
                  {variants.length > 0 && (
                    <div className="pt-8 border-t border-slate-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        قائمة المتغيرات
                      </h3>
                      <div className="flow-root">
                        <div className="-mx-1 -my-2 overflow-x-auto">
                          <div className="inline-block min-w-full py-2 align-middle">
                            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                              {variants.map((variant, index) => (
                                // --- MODIFIED: Grid layout for 3 columns ---
                                <div
                                  key={variant.id}
                                  className={`p-4 ${
                                    index % 2 !== 0 ? "bg-slate-50" : ""
                                  }`}
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                                    {/* Col 1: Name */}
                                    <div className="font-medium text-slate-800 pt-2">
                                      {Object.values(variant.options).join(
                                        " / "
                                      )}
                                    </div>

                                    {/* Col 2: Price Inputs */}
                                    <div className="grid grid-cols-2 gap-3">
                                      <FormInput
                                        label="السعر"
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) =>
                                          updateVariantPrice(
                                            variant.id,
                                            "price",
                                            e.target.value
                                          )
                                        }
                                        placeholder="0.00"
                                      />
                                      <FormInput
                                        label="السعر الأصلي"
                                        type="number"
                                        value={variant.originalPrice || ""}
                                        onChange={(e) =>
                                          updateVariantPrice(
                                            variant.id,
                                            "originalPrice",
                                            e.target.value
                                          )
                                        }
                                        placeholder="0.00"
                                      />
                                    </div>

                                    {/* Col 3: MODIFIED - Multi-Image Uploader */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        صور المتغير
                                      </label>
                                      {/* This markup is copied from your subImages uploader */}
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
                                            إضافة
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
                                    {/* --- END MODIFIED --- */}
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
                  label="إضافة قسم المنتجات ذات الصلة"
                  checked={hasRelatedProducts}
                  onChange={(e) => setHasRelatedProducts(e.target.checked)}
                />
                {hasRelatedProducts && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      المنتجات ذات الصلة
                    </h4>
                    <ProductSelector
                      availableProducts={availableProductsForSelectors}
                      onProductSelect={addRelatedProduct}
                      lang={lang}
                      label="اختر المنتجات ذات الصلة"
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
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5"
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

              {/* Custom Section */}
              <div className="space-y-4">
                <FormToggle
                  label="إضافة قسم مخصص"
                  checked={hasCustomSection}
                  onChange={(e) => setHasCustomSection(e.target.checked)}
                />
                {hasCustomSection && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      القسم المخصص
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormInput
                        label="اسم القسم (العربية)"
                        value={customSectionNameAr}
                        onChange={(e) => setCustomSectionNameAr(e.target.value)}
                        error={errors.customSection}
                        required
                      />
                      <FormInput
                        label="Nom de la section (Français)"
                        value={customSectionNameFr}
                        onChange={(e) => setCustomSectionNameFr(e.target.value)}
                        error={errors.customSection}
                        required
                      />
                    </div>
                    <ProductSelector
                      availableProducts={availableProductsForSelectors}
                      onProductSelect={addCustomProduct}
                      lang={lang}
                      label="اختر المنتجات لهذا القسم"
                    />
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedCustomProducts.map((p) => (
                        <div
                          key={p.id}
                          className="relative border border-gray-200 bg-white rounded-lg p-2 flex flex-col items-center text-center shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => removeCustomProduct(p.id)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5"
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
            </div>
            {/* --- END NEW --- */}

            {/* --- Image Uploads Section --- */}
            {/* ... (no changes to this section) */}
            <div className="space-y-8 pt-6 border-t border-gray-200">
              {/* Row 1: Main and Sub Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الصورة الرئيسية
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
                          <span>{product ? "تغيير الصورة" : "تحميل صورة"}</span>
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
                        PNG, JPG, GIF up to 10MB
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
                    الصور الفرعية
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
                      <span className="text-xs text-gray-500 mt-1">إضافة</span>
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
                  صور الشهادات (اختياري)
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
                    <span className="text-xs text-gray-500 mt-1">إضافة</span>
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
        {/* ... (no changes) */}
        <div className="flex justify-end items-center gap-4 p-4 border-t border-neutral-200 bg-gray-50 rounded-b-lg">
          <CancelButton onClick={onClose} isSubmitting={isSubmitting}>
            إلغاء
          </CancelButton>
          <SubmitButton isSubmitting={isSubmitting}>
            <span>{product ? "حفظ التغييرات" : "إنشاء المنتج"}</span>
          </SubmitButton>
        </div>
      </form>

      {/* --- Color Picker Modal --- */}
      {/* ... (no changes) */}
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
