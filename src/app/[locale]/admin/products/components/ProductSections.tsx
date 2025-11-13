import React from "react";
import Image from "next/image";
import { X, PlusCircle, Trash2 } from "lucide-react";
import { Product } from "@/types";
import { Locale } from "@/i18n/config";
import FormInput from "@/components/admin/ui/FormInput";
import FormTextarea from "@/components/admin/ui/FormTextarea";
import CustomSelect from "@/components/admin/ui/CustomSelect";
import FormToggle from "@/components/admin/ui/FormToggle";
import ProductSelector from "@/components/admin/ProductSelector";
import { ValidationErrors } from "../utils/validation";

interface ProductSectionsProps {
  hasRelatedProducts: boolean;
  selectedRelatedProducts: Product[];
  hasCustomSections: boolean;
  customSections: {
    nameAr: string;
    nameFr: string;
    type: "products" | "description";
    selectedProducts: Product[];
    descriptionAr: string;
    descriptionFr: string;
  }[];
  availableProducts: Product[];
  errors: ValidationErrors;
  lang: Locale;
  onHasRelatedProductsChange: (checked: boolean) => void;
  onAddRelatedProduct: (product: Product) => void;
  onRemoveRelatedProduct: (productId: string) => void;
  onHasCustomSectionsChange: (checked: boolean) => void;
  onAddCustomSection: () => void;
  onRemoveCustomSection: (index: number) => void;
  onUpdateCustomSection: (
    index: number,
    field: string,
    value: string | "products" | "description"
  ) => void;
  onAddProductToSection: (sectionIndex: number, product: Product) => void;
  onRemoveProductFromSection: (sectionIndex: number, productId: string) => void;
  t: (key: string) => string;
}

/**
 * Component for managing product sections (related products and custom sections)
 */
export const ProductSections: React.FC<ProductSectionsProps> = ({
  hasRelatedProducts,
  selectedRelatedProducts,
  hasCustomSections,
  customSections,
  availableProducts,
  errors,
  lang,
  onHasRelatedProductsChange,
  onAddRelatedProduct,
  onRemoveRelatedProduct,
  onHasCustomSectionsChange,
  onAddCustomSection,
  onRemoveCustomSection,
  onUpdateCustomSection,
  onAddProductToSection,
  onRemoveProductFromSection,
  t,
}) => {
  return (
    <div
      id="custom-sections"
      className="space-y-6 pt-6 border-t border-gray-200"
    >
      {/* Related Products Section */}
      <div className="space-y-4">
        <FormToggle
          label={t("labels.hasRelatedProducts")}
          checked={hasRelatedProducts}
          onChange={(e) => onHasRelatedProductsChange(e.target.checked)}
        />
        {hasRelatedProducts && (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {t("labels.relatedProducts")}
            </h4>
            <ProductSelector
              availableProducts={availableProducts}
              onProductSelect={onAddRelatedProduct}
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
                    onClick={() => onRemoveRelatedProduct(p.id)}
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
          onChange={(e) => onHasCustomSectionsChange(e.target.checked)}
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
                    onClick={() => onRemoveCustomSection(index)}
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
                      onUpdateCustomSection(index, "nameAr", e.target.value)
                    }
                    error={errors[`customSection${index}`]}
                    required
                  />
                  <FormInput
                    label={t("labels.sectionNameFr")}
                    value={section.nameFr}
                    onChange={(e) =>
                      onUpdateCustomSection(index, "nameFr", e.target.value)
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
                      onUpdateCustomSection(
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
                      availableProducts={availableProducts}
                      onProductSelect={(product) =>
                        onAddProductToSection(index, product)
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
                              onRemoveProductFromSection(index, p.id)
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                          >
                            <X size={14} />
                          </button>
                          <Image
                            src={p.image}
                            alt={p.name[lang]}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-md mb-2"
                          />
                          <span className="mt-2 text-xs font-medium text-gray-700">
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
                        onUpdateCustomSection(
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
                        onUpdateCustomSection(
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
              onClick={onAddCustomSection}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-green-300 rounded-lg text-sm font-semibold text-green-600 hover:bg-green-50 hover:border-green-400 transition-all"
            >
              <PlusCircle size={18} />
              {t("labels.addCustomSection")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
