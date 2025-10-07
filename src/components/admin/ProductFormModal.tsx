"use client";

import { Category, Language, Product } from "@/types";
import { PlusCircle, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: FormData) => void;
  product: Product | null;
  categories: Category[];
  lang: Language;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  lang,
}) => {
  const [nameAr, setNameAr] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [originalPrice, setOriginalPrice] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    if (product) {
      setNameAr(product.name.ar);
      setNameFr(product.name.fr);
      setDescriptionAr(product.description.ar);
      setDescriptionFr(product.description.fr);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || "");
      setCategoryId(product.categoryId);
      setIsNew(product.isNew);
      setKeywords(product.keywords || []);
      setMainImagePreview(product.image);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      setSubImagePreviews(product.subImages.map((img) => img.url)); // Assuming subImages have a url property
    } else {
      // Reset form for new product
      setNameAr("");
      setNameFr("");
      setDescriptionAr("");
      setDescriptionFr("");
      setPrice("");
      setOriginalPrice("");
      setCategoryId("");
      setIsNew(true);
      setKeywords([]);
      setMainImage(null);
      setMainImagePreview(null);
      setSubImages([]);
      setSubImagePreviews([]);
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
      const files = Array.from(e.target.files);
      setSubImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSubImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeSubImage = (index: number) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
    setSubImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
    if (!categoryId) newErrors.categoryId = "يجب اختيار فئة.";

    // Main image is required only for new products.
    if (!product && !mainImage) {
      newErrors.mainImage = "الصورة الرئيسية مطلوبة.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return; // Stop submission if validation fails
    }

    const formData = new FormData();

    // Append product ID if it's an update
    if (product) {
      formData.append("id", product.id);
    }

    // Append text and other data
    formData.append("nameAr", nameAr);
    formData.append("nameFr", nameFr);
    formData.append("descriptionAr", descriptionAr);
    formData.append("descriptionFr", descriptionFr);
    formData.append("price", String(price));
    formData.append("originalPrice", String(originalPrice));
    formData.append("categoryId", categoryId);
    formData.append("isNew", String(isNew));

    // Keywords are sent as a JSON string array
    formData.append("keywords", JSON.stringify(keywords));

    // Append the main image file if a new one was selected
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    // Append all new sub-image files
    subImages.forEach((file) => {
      // We only append files, not existing URL strings
      if (file instanceof File) {
        formData.append("subImages", file);
      }
    });

    // In a real update scenario, you might also need to send
    // a list of sub-images to keep or delete. For now, we just send new ones.

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const title = product ? "تعديل المنتج" : "إضافة منتج جديد";

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh]"
      >
        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المنتج (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 ${
                      errors.nameAr ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.nameAr && (
                    <p className="text-red-500 text-xs mt-1">{errors.nameAr}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وصف المنتج (بالعربية)
                  </label>
                  <textarea
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 ${
                      errors.descriptionAr
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  ></textarea>
                  {errors.descriptionAr && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.descriptionAr}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      السعر (د.م.)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      السعر الأصلي (اختياري)
                    </label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الفئة
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 ${
                      errors.categoryId ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="" disabled>
                      اختر فئة
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name[lang]}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.categoryId}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    منتج جديد؟
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit (Français)
                  </label>
                  <input
                    type="text"
                    value={nameFr}
                    onChange={(e) => setNameFr(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 ${
                      errors.nameFr ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.nameFr && (
                    <p className="text-red-500 text-xs mt-1">{errors.nameFr}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description du produit (Français)
                  </label>
                  <textarea
                    value={descriptionFr}
                    onChange={(e) => setDescriptionFr(e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 ${
                      errors.descriptionFr
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  ></textarea>
                  {errors.descriptionFr && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.descriptionFr}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الكلمات المفتاحية (افصل بينها بفاصلة ,)
                  </label>
                  <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-green-700 focus-within:border-green-700">
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

            {/* Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
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
                        onClick={() => removeSubImage(index)}
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
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end items-center gap-4 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="bg-green-700 text-white font-bold py-2 px-6 rounded-md hover:bg-green-800 transition-colors"
          >
            {product ? "حفظ التغييرات" : "إنشاء المنتج"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormModal;
