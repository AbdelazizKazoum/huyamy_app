import React, { ChangeEvent } from "react";
import Image from "next/image";
import { X, PlusCircle, Trash2, Palette } from "lucide-react";
import { ProductVariant, VariantOption } from "@/types";
import { Locale } from "@/i18n/config";
import FormInput from "@/components/admin/ui/FormInput";
import CustomSelect from "@/components/admin/ui/CustomSelect";
import FormToggle from "@/components/admin/ui/FormToggle";
import ColorPickerModal from "@/components/admin/modals/ColorPickerModal";
import { PREDEFINED_OPTIONS } from "../constants/variantOptions";

interface VariantManagementProps {
  hasVariants: boolean;
  variantOptions: VariantOption[];
  variants: ProductVariant[];
  optionValueInputs: { [key: number]: string };
  customOptionFlags: { [key: number]: boolean };
  errors?: { variants?: string };
  lang: Locale;
  onHasVariantsChange: (checked: boolean) => void;
  onAddVariantOption: () => void;
  onRemoveVariantOption: (index: number) => void;
  onOptionNameChange: (index: number, value: string) => void;
  onUpdateCustomOptionName: (
    index: number,
    lang: "ar" | "fr",
    name: string
  ) => void;
  onOptionValueInputChange: (index: number, value: string) => void;
  onAddOptionValue: (optionIndex: number) => void;
  onRemoveOptionValue: (optionIndex: number, value: string) => void;
  onUpdateVariantPrice: (
    variantId: string,
    field: "price" | "originalPrice" | "isActive",
    value: number | string | boolean
  ) => void;
  onVariantImagesChange: (
    e: ChangeEvent<HTMLInputElement>,
    variantId: string
  ) => void;
  onRemoveVariantImage: (variantId: string, imageUrl: string) => void;
  t: (key: string) => string;
}

/**
 * Component for managing product variants - options, values, and variant-specific data
 */
export const VariantManagement: React.FC<VariantManagementProps> = ({
  hasVariants,
  variantOptions,
  variants,
  optionValueInputs,
  customOptionFlags,
  errors,
  lang,
  onHasVariantsChange,
  onAddVariantOption,
  onRemoveVariantOption,
  onOptionNameChange,
  onUpdateCustomOptionName,
  onOptionValueInputChange,
  onAddOptionValue,
  onRemoveOptionValue,
  onUpdateVariantPrice,
  onVariantImagesChange,
  onRemoveVariantImage,
  t,
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);
  const [currentColorPickerIndex, setCurrentColorPickerIndex] = React.useState<
    number | null
  >(null);
  const [pickerColor, setPickerColor] = React.useState("#ffffff");

  /**
   * Helper function to check if a value is a color (hex or named color)
   */
  const isColorValue = (value: string): boolean => {
    // Check if it's a hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      return true;
    }
    // Check if it's a named color (common colors)
    const namedColors = [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "pink",
      "black",
      "white",
      "gray",
      "brown",
      "cyan",
      "magenta",
      "lime",
      "navy",
      "teal",
      "silver",
      "gold",
    ];
    return namedColors.includes(value.toLowerCase());
  };

  /**
   * Get the option name in the selected language
   */
  const getOptionNameInLang = (optionKey: string): string => {
    const option = variantOptions.find((opt) => opt.name.fr === optionKey);
    return option ? option.name[lang] : optionKey;
  };

  const handleColorPickerSubmit = () => {
    if (currentColorPickerIndex === null) return;

    const value = pickerColor;

    // Set the input value to the selected color
    onOptionValueInputChange(currentColorPickerIndex, value);

    setIsColorPickerOpen(false);
    setCurrentColorPickerIndex(null);
  };

  return (
    <div
      id="variants-section"
      className="space-y-4 pt-6 border-t border-gray-200"
    >
      <FormToggle
        label={t("labels.hasVariants")}
        checked={hasVariants}
        onChange={(e) => onHasVariantsChange(e.target.checked)}
      />
      {hasVariants && (
        <div className="p-3 sm:p-5 border border-slate-200 rounded-lg bg-slate-50 space-y-6 sm:space-y-8">
          {/* Variant Options Definition */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {t("labels.variantOptions")}
            </h3>
            {variantOptions.map((option, index) => {
              const predefined = PREDEFINED_OPTIONS.find(
                (p) => p.fr === option.name.fr
              );
              const isColorOption = option.name.fr.toLowerCase() === "couleur";
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
                        label={`${t("labels.selectOption")} ${index + 1}`}
                        value={
                          customOptionFlags[index]
                            ? "custom"
                            : option.name.fr || ""
                        }
                        onChange={(value) => onOptionNameChange(index, value)}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-green-50/50 rounded-md border border-green-200">
                          <FormInput
                            label={t("labels.customOptionAr")}
                            value={option.name.ar}
                            onChange={(e) =>
                              onUpdateCustomOptionName(
                                index,
                                "ar",
                                e.target.value
                              )
                            }
                            placeholder={t("placeholders.customOptionAr")}
                          />
                          <FormInput
                            label={t("labels.customOptionFr")}
                            value={option.name.fr}
                            onChange={(e) =>
                              onUpdateCustomOptionName(
                                index,
                                "fr",
                                e.target.value
                              )
                            }
                            placeholder={t("placeholders.customOptionFr")}
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveVariantOption(index)}
                      className="mt-7 p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                      aria-label="Remove option"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("labels.optionValues")}
                  </label>

                  {isColorOption ? (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-green-600 focus-within:border-green-600 flex-grow">
                        {option.values.map((val, vIndex) => (
                          <div
                            key={vIndex}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2"
                            style={{
                              backgroundColor: val,
                              borderColor: val,
                              color:
                                val === "#ffffff" || val === "white"
                                  ? "#000"
                                  : "#fff",
                            }}
                          >
                            <span className="text-sm font-medium">{val}</span>
                            <button
                              type="button"
                              onClick={() => onRemoveOptionValue(index, val)}
                              className="hover:opacity-75"
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
                            onOptionValueInputChange(index, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              onAddOptionValue(index);
                            }
                          }}
                          className="flex-grow bg-transparent focus:outline-none min-w-[120px]"
                          placeholder={t("placeholders.enterColor")}
                        />
                      </div>
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
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-green-600 focus-within:border-green-600">
                      {option.values.map((val, vIndex) => (
                        <div
                          key={vIndex}
                          className="flex items-center gap-1.5 bg-sky-100 text-sky-800 text-sm font-medium px-2.5 py-1 rounded-full"
                        >
                          {val}
                          <button
                            type="button"
                            onClick={() => onRemoveOptionValue(index, val)}
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
                          onOptionValueInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            onAddOptionValue(index);
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
              onClick={onAddVariantOption}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-sky-300 rounded-lg text-sm font-semibold text-sky-600 hover:bg-sky-50 hover:border-sky-400 transition-all"
            >
              <PlusCircle size={18} />
              {t("labels.addOption")}
            </button>
          </div>

          {/* Generated Variants List */}
          {variants.length > 0 && (
            <div
              id="variants-list"
              className="pt-6 sm:pt-8 border-t border-slate-200"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                {t("labels.variantsList")}
              </h3>
              <div className="flow-root">
                <div className="-mx-1 -my-2 overflow-x-auto">
                  <div className="inline-block min-w-full py-2 align-middle">
                    <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                      {variants.map((variant, index) => (
                        <div
                          key={variant.id}
                          className={`p-4 sm:p-6 ${
                            index % 2 !== 0 ? "bg-slate-50" : ""
                          }`}
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                {Object.entries(variant.options).map(
                                  ([key, value]) => {
                                    const isColor = isColorValue(value);
                                    const optionName = getOptionNameInLang(key);

                                    return (
                                      <span
                                        key={key}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                                      >
                                        <span className="font-semibold">
                                          {optionName}:
                                        </span>
                                        {isColor ? (
                                          <span className="flex items-center gap-1.5">
                                            <span
                                              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 shadow-sm"
                                              style={{ backgroundColor: value }}
                                              title={value}
                                            />
                                            <span className="text-xs text-gray-600 hidden sm:inline">
                                              {value}
                                            </span>
                                          </span>
                                        ) : (
                                          <span>{value}</span>
                                        )}
                                      </span>
                                    );
                                  }
                                )}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <FormInput
                                  label={t("labels.price")}
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) =>
                                    onUpdateVariantPrice(
                                      variant.id,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                                <FormInput
                                  label={t("labels.originalPrice")}
                                  type="number"
                                  value={variant.originalPrice || ""}
                                  onChange={(e) =>
                                    onUpdateVariantPrice(
                                      variant.id,
                                      "originalPrice",
                                      e.target.value
                                    )
                                  }
                                />
                                <div className="flex items-end sm:col-span-2 lg:col-span-1">
                                  <FormToggle
                                    label={t("labels.isActive")}
                                    checked={variant.isActive ?? true}
                                    onChange={(e) =>
                                      onUpdateVariantPrice(
                                        variant.id,
                                        "isActive",
                                        e.target.checked
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("labels.variantImages")}
                              </label>
                              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                {(variant.images || []).map((img, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="relative group aspect-square"
                                  >
                                    <Image
                                      src={img}
                                      alt={`variant-${variant.id}-${imgIndex}`}
                                      fill
                                      className="object-cover rounded-md border border-gray-200"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onRemoveVariantImage(variant.id, img)
                                      }
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))}
                                <label
                                  htmlFor={`variant-images-${variant.id}`}
                                  className="flex flex-col items-center justify-center aspect-square border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                  <PlusCircle
                                    size={16}
                                    className="text-gray-400"
                                  />
                                </label>
                              </div>
                              <input
                                id={`variant-images-${variant.id}`}
                                type="file"
                                multiple
                                className="sr-only"
                                onChange={(e) =>
                                  onVariantImagesChange(e, variant.id)
                                }
                                accept="image/*"
                              />
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
          {errors?.variants && (
            <p className="text-red-500 text-sm mt-2">{errors.variants}</p>
          )}
        </div>
      )}

      {/* Color Picker Modal */}
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
