"use client";

import { useState, useEffect } from "react";
import { Language, Product, ProductVariant, Section } from "@/types";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { siteConfig } from "@/config/site";
import { features } from "@/data/features";
import ProductImageGallery from "./ProductImageGallery";
import CountdownTimer from "./CountdownTimer";
import CheckoutForm from "./forms/CheckoutForm";
import AddToCartForm from "./AddToCartForm";
import CertificationGallery from "./CertificationGallery";
import ProductVariantSelector from "./ProductVariantSelector";
import { AlsoChooseSection } from "./AlsoChooseSection";

interface ProductDisplayProps {
  product: Product;
  locale: Language;
  alsoChooseSections?: Section[]; // <-- Add this prop
}

const findVariant = (
  product: Product,
  options: { [key: string]: string }
): ProductVariant | null => {
  if (!product.variants || product.variants.length === 0) return null;
  return (
    product.variants.find((variant) =>
      Object.entries(options).every(
        ([key, value]) => variant.options[key] === value
      )
    ) || null
  );
};

const ProductDisplay: React.FC<ProductDisplayProps> = ({
  product,
  locale,
  alsoChooseSections = [],
}) => {
  console.log("🚀 ~ ProductDisplay ~ product:", product);
  const currency = siteConfig.currencies[locale];

  // Initialize selected options with the first value of each option type
  const initialOptions =
    product.variantOptions?.reduce((acc, option) => {
      acc[option.name.fr] = option.values[0];
      return acc;
    }, {} as { [key: string]: string }) || {};

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  useEffect(() => {
    const variant = findVariant(product, selectedOptions);
    setSelectedVariant(variant);
  }, [selectedOptions, product]);

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayOriginalPrice =
    selectedVariant?.originalPrice ?? product.originalPrice;

  // --- NEW: Logic to determine which images to show ---
  const hasVariantImages =
    selectedVariant &&
    selectedVariant.images &&
    selectedVariant.images.length > 0;

  const galleryProduct = {
    ...product,
    image: hasVariantImages
      ? selectedVariant!.images?.[0] ?? product.image ?? ""
      : product.image ?? "",
    subImages: hasVariantImages
      ? selectedVariant!.images?.slice(1) ?? []
      : product.subImages ?? [],
  };
  // --- END NEW ---

  // --- Accordion State for custom sections ---
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const customSections = product.customSections || [];

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="bg-white">
      <main className="py-12">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div className="relative">
              <div className="lg:sticky lg:top-24">
                <ProductImageGallery
                  product={galleryProduct}
                  lang={locale}
                  selectedVariant={selectedVariant}
                />
              </div>
            </div>

            {/* Product Details & Form */}
            <div className="space-y-6">
              {product.isNew && (
                <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {locale === "ar" ? "جديد" : "Nouveau"}
                </span>
              )}

              <h1 className="text-3xl font-bold text-gray-900">
                {product.name[locale]}
              </h1>

              {/* Price */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <p className="text-3xl font-bold text-primary-800">
                  {displayPrice.toFixed(2)} {currency}
                </p>
                {displayOriginalPrice && (
                  <p className="text-xl text-gray-400 line-through">
                    {displayOriginalPrice.toFixed(2)} {currency}
                  </p>
                )}
                {displayOriginalPrice && (
                  <span className="bg-secondary-100 text-amber-500 text-sm font-medium px-2.5 py-0.5 rounded">
                    -
                    {Math.round(
                      ((displayOriginalPrice - displayPrice) /
                        displayOriginalPrice) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                    />
                  ))}
                </div>
              </div>

              {displayOriginalPrice && <CountdownTimer lang={locale} />}

              {/* Product Description */}
              <div className="prose max-w-none pt-4 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {locale === "ar" ? "وصف المنتج" : "Description du produit"}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description[locale]}
                </p>
              </div>

              {/* --- NEW: Custom Sections as Accordions (under description) --- */}
              {customSections.length > 0 && (
                <div className="mt-6 border-t border-gray-200">
                  {customSections.map((section, idx) => {
                    const name =
                      section.name?.[locale] ?? section.name?.fr ?? "";
                    const isOpen = !!openSections[idx];

                    return (
                      <div
                        key={idx}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(idx)}
                          className="w-full flex items-center justify-between gap-4 px-4 py-5 focus:outline-none"
                          aria-expanded={isOpen}
                        >
                          <div className="flex items-center gap-3">
                            <h3
                              className={`text-lg font-semibold transition-colors ${
                                isOpen ? "text-primary-800" : "text-gray-800"
                              }`}
                            >
                              {name ||
                                (locale === "ar"
                                  ? `القسم ${idx + 1}`
                                  : `Section ${idx + 1}`)}
                            </h3>
                            {section.type === "products" && (
                              <span className="text-xs text-primary-800 bg-primary-100 px-2.5 py-0.5 rounded-full">
                                {section.products?.length ?? 0}{" "}
                                {locale === "ar" ? "منتج" : "products"}
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-primary-700 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : "rotate-0"
                            }`}
                          >
                            <ChevronDown size={20} />
                          </span>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="px-4 pb-5 pt-2">
                              {/* Content */}
                              {section.type === "description" ? (
                                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                  <p>
                                    {section.description?.[locale] ||
                                      (locale === "ar"
                                        ? "لا يوجد وصف."
                                        : "No description.")}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  {section.products &&
                                  section.products.length > 0 ? (
                                    <AlsoChooseSection
                                      section={
                                        {
                                          data: {
                                            // title: section.name || {},
                                            ctaProducts: section.products,
                                          },
                                        } as Section
                                      }
                                      lang={locale}
                                    />
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      {locale === "ar"
                                        ? "لا توجد منتجات في هذا القسم."
                                        : "No products in this section."}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* --- END NEW --- */}

              {/* Variant Selector */}
              <div className="pt-4">
                <ProductVariantSelector
                  product={product}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                  lang={locale}
                />
              </div>

              {/* Purchase Forms */}
              <div className="space-y-4 pt-4">
                {(product.allowDirectPurchase ?? true) && (
                  <CheckoutForm
                    lang={locale}
                    product={product}
                    selectedVariant={selectedVariant}
                  />
                )}
                {(product.allowAddToCart ?? true) && (
                  <AddToCartForm
                    product={product}
                    lang={locale}
                    selectedVariant={selectedVariant}
                    alsoChooseSections={alsoChooseSections}
                  />
                )}
              </div>

              <CertificationGallery
                images={product.certificationImages || []}
                productName={product.name[locale]}
                locale={locale}
              />

              {/* Features/Benefits Section */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  {locale === "ar" ? "مميزات المتجر" : "Avantages du magasin"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 mb-3 text-primary-800">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {feature.title[locale]}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description[locale]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDisplay;
