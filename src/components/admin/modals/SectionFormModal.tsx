"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { Section, SectionType, Language, Product } from "@/types";
import { ChevronDown, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import FormToggle from "../ui/FormToggle";
import { useProductStore } from "@/store/useProductStore";
import ProductSelector from "../ProductSelector";
import CancelButton from "../ui/CancelButton";
import SubmitButton from "../ui/SubmitButton";

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  section: Section | null;
  // products prop is no longer needed, it will be fetched from the store
  lang: Language;
  isSubmitting?: boolean;
}

const sectionTypes: SectionType[] = [
  "hero",
  "featured",
  "popular",
  "banner",
  "newsletter",
];

const SectionFormModal: React.FC<SectionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  section,
  lang,
  isSubmitting = false,
}) => {
  // Fetch products from the product store
  const { products, fetchProducts } = useProductStore();

  // Section-level state
  const [type, setType] = useState<SectionType>("featured");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState<number | string>(0);

  // 'data' object state
  const [titleAr, setTitleAr] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [subtitleFr, setSubtitleFr] = useState("");
  const [ctaTextAr, setCtaTextAr] = useState("");
  const [ctaTextFr, setCtaTextFr] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    // Fetch products if the modal is open and they haven't been fetched yet
    if (isOpen && products.length === 0) {
      fetchProducts();
    }

    if (section) {
      setType(section.type);
      setIsActive(section.isActive ?? true);
      setOrder(section.order ?? 0);
      setTitleAr(section.data.title?.ar || "");
      setTitleFr(section.data.title?.fr || "");
      setSubtitleAr(section.data.subtitle?.ar || "");
      setSubtitleFr(section.data.subtitle?.fr || "");
      setCtaTextAr(section.data.ctaText?.ar || "");
      setCtaTextFr(section.data.ctaText?.fr || "");
      setCtaUrl(section.data.ctaUrl || "");
      setSelectedProductIds(section.data.ctaProductIds || []);
      setImageFile(null);
      setImagePreview(section.data.imageUrl || null);
    } else {
      // Reset form
      setType("featured");
      setIsActive(true);
      setOrder(0);
      setTitleAr("");
      setTitleFr("");
      setSubtitleAr("");
      setSubtitleFr("");
      setCtaTextAr("");
      setCtaTextFr("");
      setCtaUrl("");
      setSelectedProductIds([]);
      setImageFile(null);
      setImagePreview(null);
    }
    setErrors({});
  }, [section, isOpen, products.length, fetchProducts]);

  // Memoize lists for performance
  const selectedProducts = useMemo(
    () => products.filter((p) => selectedProductIds.includes(p.id)),
    [products, selectedProductIds]
  );
  const availableProducts = useMemo(
    () => products.filter((p) => !selectedProductIds.includes(p.id)),
    [products, selectedProductIds]
  );

  const addProductToSection = (productId: string) => {
    if (productId && !selectedProductIds.includes(productId)) {
      setSelectedProductIds((prev) => [...prev, productId]);
    }
  };

  const removeProductFromSection = (productId: string) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const sectionData = {
      type,
      isActive,
      order: Number(order),
      data: {
        title: { ar: titleAr, fr: titleFr },
        subtitle: { ar: subtitleAr, fr: subtitleFr },
        ctaText: { ar: ctaTextAr, fr: ctaTextFr },
        ctaUrl,
        ctaProductIds: selectedProductIds,
      },
    };

    const formData = new FormData();
    formData.append("sectionData", JSON.stringify(sectionData));
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const title = section ? "تعديل القسم" : "إضافة قسم جديد";

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* ... Modal Header ... */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6">
            {/* Core Section Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormSelect
                label="نوع القسم"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as SectionType)}
              >
                {sectionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </FormSelect>
              <FormInput
                label="الترتيب"
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
              <FormToggle
                label="فعال؟"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </div>

            <hr />

            {/* Dynamic Data Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="العنوان (العربية)"
                id="titleAr"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
              />
              <FormInput
                label="العنوان (الفرنسية)"
                id="titleFr"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
              />
              <FormInput
                label="العنوان الفرعي (العربية)"
                id="subtitleAr"
                value={subtitleAr}
                onChange={(e) => setSubtitleAr(e.target.value)}
              />
              <FormInput
                label="العنوان الفرعي (الفرنسية)"
                id="subtitleFr"
                value={subtitleFr}
                onChange={(e) => setSubtitleFr(e.target.value)}
              />
            </div>

            {/* CTA Fields */}
            {(type === "hero" || type === "banner") && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="نص الزر (العربية)"
                  id="ctaTextAr"
                  value={ctaTextAr}
                  onChange={(e) => setCtaTextAr(e.target.value)}
                />
                <FormInput
                  label="نص الزر (الفرنسية)"
                  id="ctaTextFr"
                  value={ctaTextFr}
                  onChange={(e) => setCtaTextFr(e.target.value)}
                />
                <FormInput
                  label="رابط الزر"
                  id="ctaUrl"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                />
              </div>
            )}

            {/* REPLACED Product Selector UI */}
            {(type === "featured" || type === "popular") && (
              <div className="space-y-4">
                <ProductSelector
                  availableProducts={availableProducts}
                  onProductSelect={addProductToSection}
                  lang={lang}
                  label="المنتجات المعروضة"
                />

                {/* ENHANCED Selected Products Display (no changes here) */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 min-h-[150px]">
                  {selectedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="relative border border-gray-200 bg-white rounded-lg p-2 flex flex-col items-center text-center shadow-sm transition-all duration-200 hover:shadow-md hover:border-green-400"
                        >
                          <button
                            type="button"
                            onClick={() => removeProductFromSection(p.id)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 z-10 hover:bg-red-700 transition-colors"
                          >
                            <X size={14} />
                          </button>
                          <Image
                            src={p.image}
                            alt={p.name[lang]}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-md bg-gray-100"
                          />
                          <span className="mt-2 text-xs font-medium text-gray-700 w-full truncate">
                            {p.name[lang]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-500">
                      لم يتم اختيار أي منتجات بعد.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Upload */}
            {(type === "hero" || type === "banner") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صورة الخلفية
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={100}
                      className="h-24 w-auto object-contain"
                    />
                  ) : (
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <p>انقر للتحميل</p>
                    </div>
                  )}
                </div>
                <input
                  id="image-upload"
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </fieldset>
        </div>

        {/* ... Modal Footer ... */}
        <div className="flex justify-end items-center gap-4 p-4 border-t border-neutral-200 bg-gray-50 rounded-b-lg">
          <CancelButton onClick={onClose} isSubmitting={isSubmitting}>
            إلغاء
          </CancelButton>
          <SubmitButton isSubmitting={isSubmitting}>
            <span>{section ? "حفظ التغييرات" : "إنشاء القسم"}</span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default SectionFormModal;
