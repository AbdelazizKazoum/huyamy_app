import React from "react";
import { X } from "lucide-react";
import { Category } from "@/types";
import { Locale } from "@/i18n/config";
import FormInput from "@/components/admin/ui/FormInput";
import FormTextarea from "@/components/admin/ui/FormTextarea";
import CustomSelect from "@/components/admin/ui/CustomSelect";
import FormToggle from "@/components/admin/ui/FormToggle";
import { ValidationErrors } from "../utils/validation";

interface BasicProductInfoProps {
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  descriptionFr: string;
  price: number | string;
  originalPrice: number | string;
  selectedCategoryJSON: string;
  isNew: boolean;
  keywords: string[];
  keywordsInput: string;
  allowDirectPurchase: boolean;
  allowAddToCart: boolean;
  hasVariants: boolean;
  categories: Category[];
  errors: ValidationErrors;
  lang: Locale;
  onNameArChange: (value: string) => void;
  onNameFrChange: (value: string) => void;
  onDescriptionArChange: (value: string) => void;
  onDescriptionFrChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onOriginalPriceChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onIsNewChange: (checked: boolean) => void;
  onKeywordsInputChange: (value: string) => void;
  onKeywordKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveKeyword: (keyword: string) => void;
  onDirectPurchaseChange: (checked: boolean) => void;
  onAddToCartChange: (checked: boolean) => void;
  t: (key: string) => string;
}

/**
 * Component for basic product information fields
 */
export const BasicProductInfo: React.FC<BasicProductInfoProps> = ({
  nameAr,
  nameFr,
  descriptionAr,
  descriptionFr,
  price,
  originalPrice,
  selectedCategoryJSON,
  isNew,
  keywords,
  keywordsInput,
  allowDirectPurchase,
  allowAddToCart,
  hasVariants,
  categories,
  errors,
  lang,
  onNameArChange,
  onNameFrChange,
  onDescriptionArChange,
  onDescriptionFrChange,
  onPriceChange,
  onOriginalPriceChange,
  onCategoryChange,
  onIsNewChange,
  onKeywordsInputChange,
  onKeywordKeyDown,
  onRemoveKeyword,
  onDirectPurchaseChange,
  onAddToCartChange,
  t,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <FormInput
          label={t("labels.nameAr")}
          id="nameAr"
          value={nameAr}
          onChange={(e) => onNameArChange(e.target.value)}
          error={errors.nameAr}
          required
        />
        <FormTextarea
          label={t("labels.descriptionAr")}
          id="descriptionAr"
          value={descriptionAr}
          onChange={(e) => onDescriptionArChange(e.target.value)}
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
                onChange={(e) => onPriceChange(e.target.value)}
                error={errors.price}
                required
              />
              <FormInput
                label={t("labels.originalPrice")}
                id="originalPrice"
                type="number"
                value={originalPrice}
                onChange={(e) => onOriginalPriceChange(e.target.value)}
              />
            </>
          )}
          {hasVariants && (
            <>
              <CustomSelect
                label={t("labels.category")}
                value={selectedCategoryJSON}
                onChange={(value) => onCategoryChange(value)}
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
                        onClick={() => onRemoveKeyword(kw)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={keywordsInput}
                    onChange={(e) => onKeywordsInputChange(e.target.value)}
                    onKeyDown={onKeywordKeyDown}
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
            onChange={(value) => onCategoryChange(value)}
            error={errors.categoryId}
            id="category"
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
          onChange={(e) => onIsNewChange(e.target.checked)}
        />
        <div
          id="purchase-options"
          className="pt-4 mt-4 border-t border-gray-200"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("labels.purchaseOptions")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormToggle
              label={t("labels.directPurchase")}
              checked={allowDirectPurchase}
              onChange={(e) => onDirectPurchaseChange(e.target.checked)}
            />
            <FormToggle
              label={t("labels.addToCart")}
              checked={allowAddToCart}
              onChange={(e) => onAddToCartChange(e.target.checked)}
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
          onChange={(e) => onNameFrChange(e.target.value)}
          error={errors.nameFr}
          required
        />
        <FormTextarea
          label={t("labels.descriptionFr")}
          id="descriptionFr"
          value={descriptionFr}
          onChange={(e) => onDescriptionFrChange(e.target.value)}
          rows={4}
          error={errors.descriptionFr}
          required
        />
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
                    onClick={() => onRemoveKeyword(kw)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => onKeywordsInputChange(e.target.value)}
                onKeyDown={onKeywordKeyDown}
                className="flex-grow bg-transparent focus:outline-none"
                placeholder={t("placeholders.addKeyword")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
