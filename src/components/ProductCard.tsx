"use client";

import { Locale, Product } from "@/types";
import Image from "next/image";
import { ButtonPrimary } from "./ui";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/config";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import AddedToCartToast from "./AddedToCartToast";
import { siteConfig } from "@/config/site";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  lang?: Locale;
  currency?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang = "ar",
  currency,
}) => {
  const t = useTranslations("products");
  const { addItem } = useCartStore();
  const router = useRouter();

  const finalCurrency = currency || siteConfig.currencies[lang];
  const originalPriceNum = product.originalPrice || 0;
  let discountPercentage = 0;

  if (originalPriceNum > 0 && product.price > 0) {
    discountPercentage = Math.round(
      ((originalPriceNum - product.price) / originalPriceNum) * 100
    );
  }

  const productSlug = product.name[lang || "ar"]
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\u0600-\u06FF]/g, "");

  const seoAltText = `${product.name[lang || "ar"]} - ${product.price.toFixed(
    2
  )} ${finalCurrency}${
    product.originalPrice
      ? ` (${lang === "ar" ? "كان" : "était"} ${product.originalPrice.toFixed(
          2
        )} ${finalCurrency})`
      : ""
  } - ${
    lang === "ar"
      ? `منتج من ${siteConfig.brandName}`
      : `Produit de ${siteConfig.brandName}`
  }`;

  const hasMultipleOptions =
    product.variantOptions && product.variantOptions.length > 1;

  // Determine which options to show
  let optionsToShow = product.variantOptions || [];
  if (hasMultipleOptions) {
    const colorOption = product.variantOptions?.find(
      (option) => option.name.fr === "Couleur"
    );
    optionsToShow = colorOption
      ? [colorOption]
      : product.variantOptions && product.variantOptions.length > 0
      ? [product.variantOptions[0]]
      : [];
  }

  // Compute initial selected options based on default variant
  const defaultVariant =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null;
  const initialSelectedOptions: Record<string, string> = {};
  if (defaultVariant && optionsToShow.length > 0) {
    optionsToShow.forEach((option) => {
      const optionKey = option.name.fr;
      if (defaultVariant.options[optionKey]) {
        initialSelectedOptions[optionKey] = defaultVariant.options[optionKey];
      }
    });
  }

  const [displayImage, setDisplayImage] = useState<string>(
    defaultVariant?.images?.[0] || product.image
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(initialSelectedOptions);

  // Compute current variant based on selected options
  const currentVariant = product.variants?.find((v) =>
    Object.entries(selectedOptions).every(
      ([key, val]) => v.options[key] === val
    )
  );

  // Update display image when variant changes
  useEffect(() => {
    setDisplayImage(currentVariant?.images?.[0] || product.image);
  }, [currentVariant]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variantToAdd =
      currentVariant ||
      (product.variants && product.variants.length > 0
        ? product.variants[0]
        : null);
    addItem(product, 1, variantToAdd);

    toast.custom((t) => (
      <AddedToCartToast toastInstance={t} product={product} lang={lang} />
    ));
  };

  const handleOptionSelect = (optionKey: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionKey]: value }));
  };

  const handleCardMouseLeave = () => {
    // setSelectedOptions(initialSelectedOptions); // Reset to initial instead of {}
    // setDisplayImage(defaultVariant?.images?.[0] || product.image);
  };

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  return (
    <article
      className="group bg-white rounded-lg shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
      onMouseLeave={handleCardMouseLeave}
      onClick={handleCardClick}
      itemScope
      itemType="https://schema.org/Product"
      role="article"
      aria-label={`${product.name[lang || "ar"]} - ${product.price.toFixed(
        2
      )} ${finalCurrency}`}
    >
      <meta
        itemProp="url"
        content={`${siteConfig.url}/products/${productSlug}`}
      />
      <meta itemProp="productID" content={product.id} />

      {/* Product Image with Enhanced SEO */}
      <div
        className="relative overflow-hidden"
        itemProp="image"
        itemScope
        itemType="https://schema.org/ImageObject"
      >
        <Image
          src={displayImage}
          alt={seoAltText}
          width={400}
          height={224}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          itemProp="contentUrl"
        />
        <meta itemProp="width" content="400" />
        <meta itemProp="height" content="224" />

        {/* Product Status Badges */}
        {product.isNew && (
          <span
            className="absolute top-3 left-3 bg-secondary-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10"
            aria-label={lang === "ar" ? "منتج جديد" : "Nouveau produit"}
          >
            {lang === "ar" ? "جديد" : "Nouveau"}
          </span>
        )}
        {discountPercentage > 0 && (
          <span
            className="absolute top-3 right-3 bg-secondary-500 text-white text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 z-10"
            aria-label={
              lang === "ar"
                ? `خصم ${discountPercentage} بالمئة`
                : `Réduction de ${discountPercentage} pourcent`
            }
          >
            {lang === "ar"
              ? `${t("discount")} ${discountPercentage}%`
              : `-${discountPercentage}%`}
          </span>
        )}

        {/* Variant Options Overlay */}
        {optionsToShow.length > 0 && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-row justify-center items-center gap-2 px-2 py-1.5 transition-opacity duration-300"
            aria-label="Variant options"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {optionsToShow.map((option) => {
              const optionName = option.name[lang];
              const optionKey = option.name.fr; // Use French key for consistency with variants
              const isColorOption = option.name.fr === "Couleur";
              return option.values.map((value) => {
                const isSelected = selectedOptions[optionKey] === value;
                if (isColorOption) {
                  // Render color swatches
                  return (
                    <button
                      key={`${optionName}-${value}`}
                      onClick={() => handleOptionSelect(optionKey, value)}
                      aria-label={`Select ${optionName} ${value}`}
                      title={value}
                      style={{ backgroundColor: value }}
                      className={`w-6 h-6 rounded-full transition-all duration-300 relative ${
                        isSelected
                          ? "border-2 border-white ring-1 ring-primary-500 ring-offset-1 scale-110 shadow-lg"
                          : ""
                      } hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary-300`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white absolute inset-0 m-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                } else {
                  // Render text buttons for non-color options
                  return (
                    <button
                      key={`${optionName}-${value}`}
                      onClick={() => handleOptionSelect(optionKey, value)}
                      aria-label={`Select ${optionName} ${value}`}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 ${
                        isSelected
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                      }`}
                    >
                      {value}
                    </button>
                  );
                }
              });
            })}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 text-center flex flex-col flex-grow">
        {/* Product Name */}
        <div className="h-14 flex items-center justify-center mb-2">
          <h3
            className="text-lg font-semibold text-neutral-800 leading-tight px-1 transition-all duration-300 group-hover:underline group-hover:decoration-primary-500 group-hover:underline-offset-4"
            itemProp="name"
            title={product.name[lang || "ar"]}
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              wordBreak: "break-word",
              hyphens: "auto",
              lineHeight: "1.4",
              maxHeight: "3.5rem",
            }}
          >
            {product.name[lang || "ar"]}
          </h3>
        </div>

        <meta
          itemProp="description"
          content={
            product.description?.[lang || "ar"] || product.name[lang || "ar"]
          }
        />

        <div
          itemProp="brand"
          itemScope
          itemType="https://schema.org/Brand"
          className="sr-only"
        >
          <meta itemProp="name" content={siteConfig.brandName} />
        </div>

        {/* Price Information */}
        <div
          className="flex items-baseline justify-center gap-2 mb-4 mt-auto pt-2"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <meta itemProp="priceCurrency" content="MAD" />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <meta
            itemProp="seller"
            itemType="https://schema.org/Organization"
            content="Huyamy"
          />

          <p
            className="text-xl font-bold text-primary-900"
            itemProp="price"
            content={product.price.toFixed(2)}
          >
            {product.price.toFixed(2)} {currency}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-neutral-500 line-through">
              {product.originalPrice.toFixed(2)} {currency}
            </p>
          )}
        </div>

        {/* Button Logic */}
        {hasMultipleOptions ? (
          <Link href={`/products/${product.slug}`}>
            <ButtonPrimary
              className="w-full"
              aria-label={`${t("buyNow")} - ${product.name[lang || "ar"]}`}
            >
              {t("buyNow")}
            </ButtonPrimary>
          </Link>
        ) : (
          <ButtonPrimary
            className="w-full"
            aria-label={`${t("addToCart")} - ${product.name[lang || "ar"]}`}
            onClick={handleAddToCart}
          >
            {t("addToCart")}
          </ButtonPrimary>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
