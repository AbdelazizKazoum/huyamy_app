"use client";

import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import { Category, Language } from "@/types";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";
import CancelButton from "../ui/CancelButton";
import SubmitButton from "../ui/SubmitButton";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  category: Category | null;
  lang: Language;
  isSubmitting?: boolean;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  lang,
  isSubmitting = false,
}) => {
  const [nameAr, setNameAr] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setNameAr(category.name.ar);
      setNameFr(category.name.fr);
      setDescriptionAr(category.description.ar);
      setDescriptionFr(category.description.fr);
      setImage(null);
      setImagePreview(category.image);
    } else {
      // Reset form for new category
      setNameAr("");
      setNameFr("");
      setDescriptionAr("");
      setDescriptionFr("");
      setImage(null);
      setImagePreview(null);
    }
    setErrors({});
  }, [category, isOpen]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!nameAr.trim()) newErrors.nameAr = "اسم الفئة بالعربية مطلوب.";
    if (!nameFr.trim()) newErrors.nameFr = "اسم الفئة بالفرنسية مطلوب.";
    if (!descriptionAr.trim())
      newErrors.descriptionAr = "الوصف بالعربية مطلوب.";
    if (!descriptionFr.trim())
      newErrors.descriptionFr = "الوصف بالفرنسية مطلوب.";
    if (!category && !image) newErrors.image = "صورة الفئة مطلوبة.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const formData = new FormData();
    if (category) {
      formData.append("id", category.id);
    }
    formData.append("name[ar]", nameAr);
    formData.append("name[fr]", nameFr);
    formData.append("description[ar]", descriptionAr);
    formData.append("description[fr]", descriptionFr);
    if (image) {
      formData.append("image", image);
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const title = category ? "تعديل الفئة" : "إضافة فئة جديدة";

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
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
        <div className="overflow-y-auto p-6 space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="اسم الفئة (العربية)"
                id="nameAr"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                error={errors.nameAr}
              />
              <FormInput
                label="اسم الفئة (الفرنسية)"
                id="nameFr"
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                error={errors.nameFr}
              />
            </div>
            <FormTextarea
              label="الوصف (العربية)"
              id="descriptionAr"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              rows={3}
              error={errors.descriptionAr}
            />
            <FormTextarea
              label="الوصف (الفرنسية)"
              id="descriptionFr"
              value={descriptionFr}
              onChange={(e) => setDescriptionFr(e.target.value)}
              rows={3}
              error={errors.descriptionFr}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة الفئة
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } border-dashed rounded-md cursor-pointer`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={150}
                      height={150}
                      className="h-36 w-auto object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      اسحب وأفلت أو انقر للتحميل
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP up to 2MB
                    </p>
                  </div>
                )}
              </div>
              <input
                id="image-upload"
                ref={fileInputRef}
                name="image-upload"
                type="file"
                className="sr-only"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>
          </fieldset>
        </div>
        <div className="flex justify-end items-center gap-4 p-4 border-t border-neutral-200 bg-gray-50 rounded-b-lg">
          <CancelButton onClick={onClose} isSubmitting={isSubmitting}>
            إلغاء
          </CancelButton>
          <SubmitButton isSubmitting={isSubmitting}>
            <span>{category ? "حفظ التغييرات" : "إنشاء الفئة"}</span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormModal;
