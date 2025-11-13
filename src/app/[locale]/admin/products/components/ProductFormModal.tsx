"use client";

import React, { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Category, Product } from "@/types";
import { Locale } from "@/i18n/config";
import { useProductStore } from "@/store/useProductStore";
import SubmitButton from "@/components/admin/ui/SubmitButton";
import CancelButton from "@/components/admin/ui/CancelButton";
import { BasicProductInfo } from "./BasicProductInfo";
import { VariantManagement } from "./VariantManagement";
import {
  MainImageUpload,
  SubImagesUpload,
  CertificationImagesUpload,
} from "./ImageUpload";
import { ProductSections } from "./ProductSections";
import {
  validateProductForm,
  scrollToFirstError,
  ValidationErrors,
} from "../utils/validation";
import {
  useProductFormState,
  useProductImages,
  useProductVariants,
  useProductSections,
} from "../hooks";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: FormData) => void;
  product: Product | null;
  categories: Category[];
  lang: Locale;
  isSubmitting?: boolean;
}

/**
 * ProductFormModal - Main modal component for creating and editing products.
 * Refactored to use custom hooks and sub-components for better maintainability.
 *
 * @param isOpen - Whether the modal is visible
 * @param onClose - Callback to close the modal
 * @param onSubmit - Callback when form is submitted with FormData
 * @param product - Product to edit (null for new product)
 * @param categories - Available categories for selection
 * @param lang - Current language
 * @param isSubmitting - Whether form submission is in progress
 */
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
  const { products: allProducts } = useProductStore();

  // State Management Hooks
  const productFormState = useProductFormState(product, isOpen);
  const productImages = useProductImages(product, isOpen);
  const [hasVariants, setHasVariants] = useState(false);
  const productVariants = useProductVariants(product, isOpen, hasVariants);
  const productSections = useProductSections(product, isOpen);

  // Form Validation State
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Initialize hasVariants state from product
  React.useEffect(() => {
    if (product) {
      const productHasVariants =
        !!product.variantOptions && product.variantOptions.length > 0;
      setHasVariants(productHasVariants);
    } else {
      setHasVariants(false);
    }
  }, [product, isOpen]);

  // Calculate available products for selectors
  const availableProductsForSelectors = allProducts.filter(
    (p) =>
      (!product || p.id !== product.id) &&
      !productSections.selectedRelatedProducts.some((sp) => sp.id === p.id) &&
      !productSections.customSections.some((section) =>
        section.selectedProducts.some((sp) => sp.id === p.id)
      )
  );

  /**
   * Validates and submits the product form
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate form
    const validationErrors = validateProductForm({
      nameAr: productFormState.nameAr,
      nameFr: productFormState.nameFr,
      descriptionAr: productFormState.descriptionAr,
      descriptionFr: productFormState.descriptionFr,
      price: productFormState.price,
      selectedCategoryJSON: productFormState.selectedCategoryJSON,
      hasVariants,
      variantOptions: productVariants.variantOptions,
      variants: productVariants.variants,
      allowDirectPurchase: productFormState.allowDirectPurchase,
      allowAddToCart: productFormState.allowAddToCart,
      hasCustomSections: productSections.hasCustomSections,
      customSections: productSections.customSections,
      product,
      mainImage: productImages.mainImage,
      t,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError(validationErrors);
      return;
    }

    // Prepare product data
    const selectedCategory = productFormState.selectedCategoryJSON
      ? (JSON.parse(productFormState.selectedCategoryJSON) as Category)
      : null;

    const cleanedVariants = hasVariants
      ? productVariants.variants.map((v) => {
          const keptImages = (v.images || []).filter(
            (img) => !img.startsWith("blob:")
          );
          return { ...v, images: keptImages };
        })
      : [];

    const productData = {
      name: { ar: productFormState.nameAr, fr: productFormState.nameFr },
      description: {
        ar: productFormState.descriptionAr,
        fr: productFormState.descriptionFr,
      },
      price: Number(productFormState.price),
      originalPrice: productFormState.originalPrice
        ? Number(productFormState.originalPrice)
        : null,
      categoryId: selectedCategory?.id || "",
      category: selectedCategory,
      isNew: productFormState.isNew,
      keywords: productFormState.keywords,
      allowDirectPurchase: productFormState.allowDirectPurchase,
      allowAddToCart: productFormState.allowAddToCart,
      variantOptions: hasVariants ? productVariants.variantOptions : [],
      variants: cleanedVariants,
      relatedProducts: productSections.hasRelatedProducts
        ? {
            ids: productSections.selectedRelatedProducts.map((p) => p.id),
            products: productSections.selectedRelatedProducts,
          }
        : null,
      customSections: productSections.hasCustomSections
        ? productSections.customSections.map((section) => ({
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

    // Prepare FormData
    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));

    if (productImages.deletedSubImageUrls.length > 0) {
      formData.append(
        "deletedSubImageUrls",
        JSON.stringify(productImages.deletedSubImageUrls)
      );
    }
    if (productImages.deletedCertificationImageUrls.length > 0) {
      formData.append(
        "deletedCertificationImageUrls",
        JSON.stringify(productImages.deletedCertificationImageUrls)
      );
    }
    if (productVariants.deletedVariantImageUrls.length > 0) {
      formData.append(
        "deletedVariantImageUrls",
        JSON.stringify(productVariants.deletedVariantImageUrls)
      );
    }

    if (product) {
      formData.append("id", product.id);
    }

    if (productImages.mainImage) {
      formData.append("mainImage", productImages.mainImage);
    }
    productImages.subImages.forEach((file) => {
      formData.append("subImages", file);
    });
    productImages.certificationImages.forEach((file) => {
      formData.append("certificationImages", file);
    });

    Object.entries(productVariants.newVariantImages).forEach(
      ([variantId, files]) => {
        files.forEach((file) => {
          formData.append(variantId, file);
        });
      }
    );

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const title = product ? t("editTitle") : t("addTitle");

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
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

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6">
            {/* Basic Product Information */}
            <BasicProductInfo
              nameAr={productFormState.nameAr}
              nameFr={productFormState.nameFr}
              descriptionAr={productFormState.descriptionAr}
              descriptionFr={productFormState.descriptionFr}
              price={productFormState.price}
              originalPrice={productFormState.originalPrice}
              selectedCategoryJSON={productFormState.selectedCategoryJSON}
              isNew={productFormState.isNew}
              keywords={productFormState.keywords}
              keywordsInput={productFormState.keywordsInput}
              allowDirectPurchase={productFormState.allowDirectPurchase}
              allowAddToCart={productFormState.allowAddToCart}
              hasVariants={hasVariants}
              categories={categories}
              errors={errors}
              lang={lang}
              onNameArChange={productFormState.setNameAr}
              onNameFrChange={productFormState.setNameFr}
              onDescriptionArChange={productFormState.setDescriptionAr}
              onDescriptionFrChange={productFormState.setDescriptionFr}
              onPriceChange={productFormState.setPrice}
              onOriginalPriceChange={productFormState.setOriginalPrice}
              onCategoryChange={productFormState.setSelectedCategoryJSON}
              onIsNewChange={productFormState.setIsNew}
              onKeywordsInputChange={productFormState.setKeywordsInput}
              onKeywordKeyDown={productFormState.handleKeywordKeyDown}
              onRemoveKeyword={productFormState.removeKeyword}
              onDirectPurchaseChange={productFormState.setAllowDirectPurchase}
              onAddToCartChange={productFormState.setAllowAddToCart}
              t={t}
            />

            {/* Variant Management */}
            <VariantManagement
              hasVariants={hasVariants}
              variantOptions={productVariants.variantOptions}
              variants={productVariants.variants}
              optionValueInputs={productVariants.optionValueInputs}
              customOptionFlags={productVariants.customOptionFlags}
              errors={errors}
              lang={lang}
              onHasVariantsChange={setHasVariants}
              onAddVariantOption={productVariants.addVariantOption}
              onRemoveVariantOption={productVariants.removeVariantOption}
              onOptionNameChange={productVariants.handleOptionNameChange}
              onUpdateCustomOptionName={productVariants.updateCustomOptionName}
              onOptionValueInputChange={(index, value) =>
                productVariants.setOptionValueInputs({
                  ...productVariants.optionValueInputs,
                  [index]: value,
                })
              }
              onAddOptionValue={productVariants.addOptionValue}
              onRemoveOptionValue={productVariants.removeOptionValue}
              onUpdateVariantPrice={productVariants.updateVariantPrice}
              onVariantImagesChange={productVariants.handleVariantImagesChange}
              onRemoveVariantImage={productVariants.removeVariantImage}
              t={t}
            />

            {/* Product Sections */}
            <ProductSections
              hasRelatedProducts={productSections.hasRelatedProducts}
              selectedRelatedProducts={productSections.selectedRelatedProducts}
              hasCustomSections={productSections.hasCustomSections}
              customSections={productSections.customSections}
              availableProducts={availableProductsForSelectors}
              errors={errors}
              lang={lang}
              onHasRelatedProductsChange={productSections.setHasRelatedProducts}
              onAddRelatedProduct={productSections.addRelatedProduct}
              onRemoveRelatedProduct={productSections.removeRelatedProduct}
              onHasCustomSectionsChange={productSections.setHasCustomSections}
              onAddCustomSection={productSections.addCustomSection}
              onRemoveCustomSection={productSections.removeCustomSection}
              onUpdateCustomSection={productSections.updateCustomSection}
              onAddProductToSection={productSections.addProductToSection}
              onRemoveProductFromSection={
                productSections.removeProductFromSection
              }
              t={t}
            />

            {/* Image Uploads */}
            <div className="space-y-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MainImageUpload
                  mainImagePreview={productImages.mainImagePreview}
                  onImageChange={productImages.handleMainImageChange}
                  error={errors.mainImage}
                  isEditMode={!!product}
                  label={t("labels.mainImage")}
                  uploadText={t("labels.uploadImage")}
                  changeText={t("labels.changeImage")}
                  formatHint={t("messages.imageFormat")}
                />
                <SubImagesUpload
                  imagePreviews={productImages.subImagePreviews}
                  onImagesChange={productImages.handleSubImagesChange}
                  onRemoveImage={productImages.removeSubImage}
                  label={t("labels.subImages")}
                  addImageText={t("labels.addImage")}
                />
              </div>
              <CertificationImagesUpload
                imagePreviews={productImages.certificationImagePreviews}
                onImagesChange={productImages.handleCertificationImagesChange}
                onRemoveImage={productImages.removeCertificationImage}
                label={t("labels.certificationImages")}
                addImageText={t("labels.addImage")}
              />
            </div>
          </fieldset>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-4 p-4 border-t border-neutral-200 bg-gray-50 rounded-b-lg">
          <CancelButton onClick={onClose} isSubmitting={isSubmitting}>
            {t("buttons.cancel")}
          </CancelButton>
          <SubmitButton isSubmitting={isSubmitting}>
            <span>{product ? t("buttons.save") : t("buttons.create")}</span>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default ProductFormModal;
