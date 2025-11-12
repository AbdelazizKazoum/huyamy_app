"use client";

import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import { Section, SectionType, Language, Product } from "@/types";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import FormSelect from "@/components/admin/ui/FormSelect";
import FormToggle from "@/components/admin/ui/FormToggle";
import { useProductStore } from "@/store/useProductStore";
import CancelButton from "@/components/admin/ui/CancelButton";
import SubmitButton from "@/components/admin/ui/SubmitButton";
import CloseButton from "@/components/admin/ui/CloseButton";
import { useTranslations } from "next-intl";
import SectionDataFields from "./SectionDataFields";
import SectionCTAFields from "./SectionCTAFields";
import SectionProductDisplay from "./SectionProductDisplay";

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  section: Section | null;
  lang: Language;
  isSubmitting?: boolean;
}

// Define the simplified and localized section type options
const sectionTypeOptions: {
  value: string;
  label: { [key in Language]: string };
}[] = [
  { value: "landing-page", label: { ar: "صفحة الهبوط", fr: "Page d'accueil" } },
  {
    value: "featured",
    label: { ar: "منتجات موصى بها", fr: "Produits Recommandés" },
  },
  { value: "also-choose", label: { ar: "اختر أيضًا", fr: "Choisissez aussi" } }, // <-- Added option
];

const SectionFormModal: React.FC<SectionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  section,
  lang,
  isSubmitting = false,
}) => {
  const t = useTranslations("admin.sections.modal");

  // Fetch products from the product store (no longer needed to call fetchProducts here, as ProductSelector handles it)
  const { products } = useProductStore();

  // Section-level state
  const [type, setType] = useState<string>("landing-page"); // Default to landing-page
  const [isActive, setIsActive] = useState(true);

  // 'data' object state
  const [titleAr, setTitleAr] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [subtitleFr, setSubtitleFr] = useState("");
  const [ctaTextAr, setCtaTextAr] = useState("");
  const [ctaTextFr, setCtaTextFr] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]); // Changed to store full Product objects

  // Search state for product selection
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (section) {
      setType(section.type);
      setIsActive(section.isActive ?? true);
      setTitleAr(section.data.title?.ar || "");
      setTitleFr(section.data.title?.fr || "");
      setSubtitleAr(section.data.subtitle?.ar || "");
      setSubtitleFr(section.data.subtitle?.fr || "");
      setCtaTextAr(section.data.ctaText?.ar || "");
      setCtaTextFr(section.data.ctaText?.fr || "");
      setCtaUrl(section.data.ctaUrl || "");
      // Assuming section.data.ctaProducts contains full objects; if not, derive from ids
      setSelectedProducts(section.data.ctaProducts || []);
      setImageFile(null);
      setImagePreview(section.data.imageUrl || null);
    } else {
      // Reset form
      setType("landing-page"); // Default to landing-page
      setIsActive(true);
      setTitleAr("");
      setTitleFr("");
      setSubtitleAr("");
      setSubtitleFr("");
      setCtaTextAr("");
      setCtaTextFr("");
      setCtaUrl("");
      setSelectedProducts([]);
      setProductSearchTerm("");
      setImageFile(null);
      setImagePreview(null);
    }
    // setErrors({}); // Removed unused errors state
  }, [section, isOpen]);

  const addProductToSection = (product: Product) => {
    if (!selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const removeProductFromSection = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
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
      data: {
        title: { ar: titleAr, fr: titleFr },
        subtitle: { ar: subtitleAr, fr: subtitleFr },
        ctaText: { ar: ctaTextAr, fr: ctaTextFr },
        ctaUrl,
        ctaProductIds: selectedProducts.map((p) => p.id), // Derive IDs for submission
        ctaProducts: selectedProducts, // Include full objects if needed by backend
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

  const title = section ? t("editTitle") : t("addTitle");

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <CloseButton onClick={onClose} disabled={isSubmitting} />
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6">
            {/* Core Section Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label={t("labels.type")}
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as SectionType)}
              >
                {sectionTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label[lang]}
                  </option>
                ))}
              </FormSelect>
              <div className="flex items-end pb-2">
                <FormToggle
                  label={t("labels.isActive")}
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Dynamic Data Fields */}
            <SectionDataFields
              titleAr={titleAr}
              titleFr={titleFr}
              subtitleAr={subtitleAr}
              subtitleFr={subtitleFr}
              onTitleArChange={setTitleAr}
              onTitleFrChange={setTitleFr}
              onSubtitleArChange={setSubtitleAr}
              onSubtitleFrChange={setSubtitleFr}
            />

            {/* CTA Fields */}
            {(type === "hero" || type === "banner") && (
              <SectionCTAFields
                ctaTextAr={ctaTextAr}
                ctaTextFr={ctaTextFr}
                ctaUrl={ctaUrl}
                onCtaTextArChange={setCtaTextAr}
                onCtaTextFrChange={setCtaTextFr}
                onCtaUrlChange={setCtaUrl}
              />
            )}

            {/* Product Selector UI - Now always visible */}
            <SectionProductDisplay
              products={products}
              selectedProductIds={selectedProducts.map((p) => p.id)}
              onProductSelectionChange={(productId, checked) => {
                if (checked) {
                  const product = products.find((p) => p.id === productId);
                  if (product) addProductToSection(product);
                } else {
                  removeProductFromSection(productId);
                }
              }}
              searchTerm={productSearchTerm}
              onSearchTermChange={setProductSearchTerm}
              lang={lang}
            />

            {/* Image Upload */}
            {(type === "hero" || type === "banner") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("labels.backgroundImage")}
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
                      <p>{t("messages.clickToUpload")}</p>
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

        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-4 p-4 border-t border-neutral-200 bg-gray-50 rounded-b-lg">
          <CancelButton onClick={onClose} isSubmitting={isSubmitting}>
            {t("buttons.cancel")}
          </CancelButton>
          <SubmitButton isSubmitting={isSubmitting}>
            <span>{section ? t("buttons.save") : t("buttons.create")}</span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default SectionFormModal;
