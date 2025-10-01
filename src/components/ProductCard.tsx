import { Locale, Product } from "@/types";
import Image from "next/image";
import { ButtonPrimary } from "./ui";
import { useTranslations } from "next-intl";

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

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name[lang || "ar"]}
          width={400}
          height={224}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-secondary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {lang === "ar" ? "جديد" : "Nouveau"}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="absolute top-3 right-3 bg-secondary-500 text-white text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {lang === "ar"
              ? `${t("discount")} ${discountPercentage}%`
              : `-${discountPercentage}%`}
          </span>
        )}
      </div>
      <div className="p-4 text-center flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-neutral-800 truncate mb-2 h-14 flex items-center justify-center">
          {product.name[lang || "ar"]}
        </h3>
        <div className="flex items-baseline justify-center gap-2 mb-4">
          <p className="text-xl font-bold text-primary-900">
            {product.price.toFixed(2)} {currency}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-neutral-400 line-through">
              {product.originalPrice.toFixed(2)} {currency}
            </p>
          )}
        </div>
        <ButtonPrimary className="w-full mt-auto">
          {t("addToCart")}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default ProductCard;
