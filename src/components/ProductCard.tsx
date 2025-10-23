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
import { useState } from "react";

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
  const [displayImage, setDisplayImage] = useState<string>(product.image);
  const [activeColor, setActiveColor] = useState<string | null>(null);

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
      ? `منتج طبيعي من ${siteConfig.brandName}`
      : `Produit naturel de ${siteConfig.brandName}`
  }`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant =
      product.variants && product.variants.length > 0
        ? product.variants[0]
        : null;

    addItem(product, 1, defaultVariant);

    toast.custom((t) => (
      <AddedToCartToast toastInstance={t} product={product} lang={lang} />
    ));
  };

  const colorOptionKey = lang === "ar" ? "اللون" : "Couleur";
  const colorOption = product.variantOptions?.find(
    (opt) => opt.name[lang] === colorOptionKey
  );
  const colorValues = colorOption?.values || [];

  const handleColorClick = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveColor(color);

    const variant = product.variants?.find(
      (v) => v.options[colorOptionKey] === color
    );

    // Using '(variant as any)' in case 'images' is not in your base type
    const variantImage = variant?.images?.[0];

    if (variantImage) {
      setDisplayImage(variantImage);
    } else {
      setDisplayImage(product.image);
    }
  };

  const handleCardMouseLeave = () => {
    setActiveColor(null);
    setDisplayImage(product.image);
  };

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <article
        className="group bg-white rounded-lg shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
        onMouseLeave={handleCardMouseLeave}
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
          className="relative overflow-hidden" // This 'relative' is the anchor
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

          {/* --- UPDATED: Color Swatches Overlay --- */}
          {colorValues.length > 0 && (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-row justify-center items-center gap-2 px-2 py-1.5 transition-opacity duration-300"
              aria-label="Available colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {colorValues.map((color) => {
                const isActive = activeColor === color;
                return (
                  <button
                    key={color}
                    onClick={(e) => handleColorClick(e, color)}
                    aria-label={`Select color ${color}`}
                    title={color}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border transition-all duration-200
            ${
              isActive
                ? "border-primary-500 ring-2 ring-primary-400 ring-offset-2 scale-110"
                : "border-neutral-200 ring-1 ring-neutral-200 ring-offset-2"
            }
            shadow-sm hover:scale-105`}
                  />
                );
              })}
            </div>
          )}
          {/* --- End Color Swatches --- */}
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
            <meta
              itemProp="availability"
              content="https://schema.org/InStock"
            />
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

          {/* Buy Now Button */}
          <ButtonPrimary
            className="w-full"
            aria-label={`${t("buyNow")} - ${product.name[lang || "ar"]}`}
            onClick={handleAddToCart}
          >
            {t("addToCart")}
          </ButtonPrimary>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
