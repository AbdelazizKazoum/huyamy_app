"use client";

import { useState, useEffect } from "react";
import { Language, Product, ProductVariant } from "@/types";
import { Star } from "lucide-react";
import { siteConfig } from "@/config/site";
import { features } from "@/data/features";
import ProductImageGallery from "./ProductImageGallery";
import CountdownTimer from "./CountdownTimer";
import CheckoutForm from "./forms/CheckoutForm";
import AddToCartForm from "./AddToCartForm";
import CertificationGallery from "./CertificationGallery";
import ProductVariantSelector from "./ProductVariantSelector";

interface ProductDisplayProps {
  product: Product;
  locale: Language;
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

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product, locale }) => {
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

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="bg-white">
      <main className="py-12">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div>
              <ProductImageGallery product={product} lang={locale} />
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
