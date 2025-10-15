"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  // ... other imports
} from "react";
import { Category, Language, Product } from "@/types";
import { PlusCircle, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";
import FormSelect from "../ui/FormSelect";
import FormToggle from "../ui/FormToggle";
import SubmitButton from "../ui/SubmitButton";
import CancelButton from "../ui/CancelButton";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: FormData) => void;
  product: Product | null;
  categories: Category[];
  lang: Language;
  isSubmitting?: boolean; // Add this prop
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  lang,
  isSubmitting = false, // Use the prop
}) => {
  const [nameAr, setNameAr] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [originalPrice, setOriginalPrice] = useState<number | string>("");
  // This state will now hold the stringified category object
  const [selectedCategoryJSON, setSelectedCategoryJSON] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  // New state to track URLs of existing images to be deleted
  const [deletedSubImageUrls, setDeletedSubImageUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  // New state for purchase options
  const [allowDirectPurchase, setAllowDirectPurchase] = useState(true);
  const [allowAddToCart, setAllowAddToCart] = useState(true);
  // New state for certification images
  const [certificationImages, setCertificationImages] = useState<File[]>([]);
  const [certificationImagePreviews, setCertificationImagePreviews] = useState<
    string[]
  >([]);
  const [deletedCertificationImageUrls, setDeletedCertificationImageUrls] =
    useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setNameAr(product.name.ar);
      setNameFr(product.name.fr);
      setDescriptionAr(product.description.ar);
      setDescriptionFr(product.description.fr);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || "");
      // When editing, stringify the existing category object to set the select's value
      setSelectedCategoryJSON(
        product.category ? JSON.stringify(product.category) : ""
      );
      setIsNew(product.isNew);
      setKeywords(product.keywords || []);
      setMainImage(null);
      setMainImagePreview(product.image);
      setSubImages([]);
      // Set previews directly from the string array of URLs
      setSubImagePreviews(product.subImages || []);
      // Reset the deleted images list
      setDeletedSubImageUrls([]);
      // Set certification images
      setCertificationImages([]);
      setCertificationImagePreviews(product.certificationImages || []);
      setDeletedCertificationImageUrls([]);
      // Set purchase options from existing product, defaulting to true
      setAllowDirectPurchase(product.allowDirectPurchase ?? true);
      setAllowAddToCart(product.allowAddToCart ?? true);
    } else {
      // Reset form for new product
      setNameAr("");
      setNameFr("");
      setDescriptionAr("");
      setDescriptionFr("");
      setPrice("");
      setOriginalPrice("");
      setSelectedCategoryJSON(""); // Reset category selection
      setIsNew(true);
      setKeywords([]);
      setKeywordsInput("");
      setMainImage(null);
      setMainImagePreview(null);
      setSubImages([]);
      setSubImagePreviews([]);
      setDeletedSubImageUrls([]);
      // Reset certification images
      setCertificationImages([]);
      setCertificationImagePreviews([]);
      setDeletedCertificationImageUrls([]);
      // Default purchase options for new products
      setAllowDirectPurchase(true);
      setAllowAddToCart(true);
    }
    // Clear errors when modal opens or product changes
    setErrors({});
  }, [product, isOpen]);

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
    // Check if the preview URL is a blob URL (a new file) or an existing http URL
    if (previewUrl.startsWith("blob:")) {
      // This is a new file that hasn't been uploaded yet.
      // We need to find which file corresponds to this blob URL.
      const fileIndexToRemove = subImagePreviews
        .slice(subImagePreviews.length - subImages.length)
        .findIndex((p) => p === previewUrl);

      if (fileIndexToRemove !== -1) {
        setSubImages((prev) => prev.filter((_, i) => i !== fileIndexToRemove));
      }
    } else {
      // This is an existing image URL from the database.
      // Add it to the list of images to be deleted on the backend.
      setDeletedSubImageUrls((prev) => [...prev, previewUrl]);
    }

    // In both cases, remove the preview from the UI.
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

    if (!nameAr.trim()) newErrors.nameAr = "اسم المنتج بالعربية مطلوب.";
    if (!nameFr.trim()) newErrors.nameFr = "اسم المنتج بالفرنسية مطلوب.";
    if (!descriptionAr.trim())
      newErrors.descriptionAr = "وصف المنتج بالعربية مطلوب.";
    if (!descriptionFr.trim())
      newErrors.descriptionFr = "وصف المنتج بالفرنسية مطلوب.";
    if (!price || Number(price) <= 0)
      newErrors.price = "السعر يجب أن يكون رقمًا موجبًا.";
    // Validate that a category has been selected
    if (!selectedCategoryJSON) newErrors.categoryId = "يجب اختيار فئة.";

    // Main image is required only for new products.
    if (!product && !mainImage) {
      newErrors.mainImage = "الصورة الرئيسية مطلوبة لمنتج جديد.";
    }

    // Ensure at least one purchase option is enabled
    if (!allowDirectPurchase && !allowAddToCart) {
      newErrors.purchaseOptions = "يجب تفعيل خيار شراء واحد على الأقل.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) {
      return;
    }

    // Parse the selected category JSON string back into an object
    const selectedCategory = selectedCategoryJSON
      ? (JSON.parse(selectedCategoryJSON) as Category)
      : null;

    // 1. Consolidate all non-file data into a single object.
    const productData = {
      name: { ar: nameAr, fr: nameFr },
      description: { ar: descriptionAr, fr: descriptionFr },
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      // Include both the ID and the full object
      categoryId: selectedCategory?.id || "",
      category: selectedCategory,
      isNew,
      keywords,
      // Add purchase options to the data
      allowDirectPurchase,
      allowAddToCart,
    };

    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));

    // Append deleted image URLs for the backend to process
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

    // Append product ID separately for updates, as it's crucial for backend routing/logic.
    if (product) {
      formData.append("id", product.id);
    }

    // 3. Append image files separately.
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    subImages.forEach((file) => {
      formData.append("subImages", file);
    });
    certificationImages.forEach((file) => {
      formData.append("certificationImages", file);
    });

    // --- For Debugging ---
    // Log the JSON data and file data separately for clarity.
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
    console.log("--------------------------");

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const title = product ? "تعديل المنتج" : "إضافة منتج جديد";

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            type="button" // Change to type="button" to prevent form submission
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6">
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
                  <FormInput
                    label="السعر (د.م.)"
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
                </div>
                <FormSelect
                  label="الفئة"
                  id="category"
                  value={selectedCategoryJSON}
                  onChange={(e) => setSelectedCategoryJSON(e.target.value)}
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
                </FormSelect>
                <FormToggle
                  label="منتج جديد؟"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
                {/* Purchase Options Section */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الكلمات المفتاحية (افصل بينها بفاصلة ,)
                  </label>
                  {/* Keywords input can also be refactored, but is left here for simplicity */}
                  <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-green-700">
                    {keywords.map((kw, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full"
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
              </div>
            </div>

            {/* --- Image Uploads Section --- */}
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
                      <div key={index} className="relative">
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
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
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
                    <div key={index} className="relative">
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
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="certification-images-upload"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
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
        <div className="flex justify-end items-center gap-4 p-4 border-t border-neutral-200 bg-gray-50 rounded-b-lg">
          <CancelButton onClick={onClose} isSubmitting={isSubmitting}>
            إلغاء
          </CancelButton>
          <SubmitButton isSubmitting={isSubmitting}>
            <span>{product ? "حفظ التغييرات" : "إنشاء المنتج"}</span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default ProductFormModal;
