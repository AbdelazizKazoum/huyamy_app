import { Locale, Product } from "@/types";
import Image from "next/image";
import { ButtonPrimary } from "./ui";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/config";

interface ProductCardProps {
  product: Product;
  lang?: Locale;
  currency?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang = "ar",
  currency = "د.م.",
}) => {
  const t = useTranslations("products");
  const originalPriceNum = product.originalPrice || 0;
  let discountPercentage = 0;

  if (originalPriceNum > 0 && product.price > 0) {
    discountPercentage = Math.round(
      ((originalPriceNum - product.price) / originalPriceNum) * 100
    );
  }

  // Create a URL-friendly name by replacing spaces and special characters
  const productSlug = product.name[lang || "ar"]
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\u0600-\u06FF]/g, ""); // Keep Arabic characters and Latin letters/numbers

  // SEO-optimized alt text
  const seoAltText = `${product.name[lang || "ar"]} - ${product.price.toFixed(2)} ${currency}${
    product.originalPrice ? ` (${lang === "ar" ? "كان" : "était"} ${product.originalPrice.toFixed(2)} ${currency})` : ""
  } - ${lang === "ar" ? "منتج مغربي طبيعي من هيوامي" : "Produit marocain naturel de Huyamy"}`;

  return (
    <Link href={`/products/${productSlug}`} className="block">
      {/* Schema.org Product Microdata */}
      <article 
        className="group bg-white rounded-lg shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
        itemScope 
        itemType="https://schema.org/Product"
        role="article"
        aria-label={`${product.name[lang || "ar"]} - ${product.price.toFixed(2)} ${currency}`}
      >
        {/* Product URL for SEO */}
        <meta itemProp="url" content={`https://huyamy.com/products/${productSlug}`} />
        <meta itemProp="productID" content={product.id} />
        
        {/* Product Image with Enhanced SEO */}
        <div className="relative overflow-hidden" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
          <Image
            src={product.image}
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
              className="absolute top-3 left-3 bg-secondary-500 text-white text-xs font-semibold px-3 py-1 rounded-full"
              aria-label={lang === "ar" ? "منتج جديد" : "Nouveau produit"}
            >
              {lang === "ar" ? "جديد" : "Nouveau"}
            </span>
          )}
          {discountPercentage > 0 && (
            <span 
              className="absolute top-3 right-3 bg-secondary-500 text-white text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
              aria-label={lang === "ar" ? `خصم ${discountPercentage} بالمئة` : `Réduction de ${discountPercentage} pourcent`}
            >
              {lang === "ar"
                ? `${t("discount")} ${discountPercentage}%`
                : `-${discountPercentage}%`}
            </span>
          )}
        </div>
        
        {/* Product Information */}
        <div className="p-4 text-center flex flex-col flex-grow">
          {/* Product Name with Schema */}
          <h3 
            className="text-lg font-semibold text-neutral-800 truncate mb-2 h-14 flex items-center justify-center"
            itemProp="name"
          >
            {product.name[lang || "ar"]}
          </h3>
          
          {/* Hidden description for SEO */}
          <meta itemProp="description" content={product.description?.[lang || "ar"] || product.name[lang || "ar"]} />
          
          {/* Brand Information */}
          <div itemProp="brand" itemScope itemType="https://schema.org/Brand" className="sr-only">
            <meta itemProp="name" content="Huyamy" />
          </div>
          
          {/* Price Information with Schema */}
          <div 
            className="flex items-baseline justify-center gap-2 mb-4"
            itemProp="offers" 
            itemScope 
            itemType="https://schema.org/Offer"
          >
            <meta itemProp="priceCurrency" content="MAD" />
            <meta itemProp="availability" content="https://schema.org/InStock" />
            <meta itemProp="seller" itemType="https://schema.org/Organization" content="Huyamy" />
            
            <p 
              className="text-xl font-bold text-primary-900"
              itemProp="price"
              content={product.price.toFixed(2)}
            >
              {product.price.toFixed(2)} {currency}
            </p>
            {product.originalPrice && (
              <p 
                className="text-sm text-neutral-400 line-through"
                itemProp="priceSpecification"
                itemScope
                itemType="https://schema.org/PriceSpecification"
              >
                <meta itemProp="price" content={product.originalPrice.toFixed(2)} />
                <meta itemProp="priceCurrency" content="MAD" />
                {product.originalPrice.toFixed(2)} {currency}
              </p>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <ButtonPrimary
            className="w-full mt-auto"
            aria-label={`${t("addToCart")} - ${product.name[lang || "ar"]}`}
            // onClick={(e) => {
            //   e.preventDefault(); // Prevent navigation when clicking the button
            //   e.stopPropagation();
            //   // Add to cart logic here
            // }}
          >
            {t("addToCart")}
          </ButtonPrimary>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
