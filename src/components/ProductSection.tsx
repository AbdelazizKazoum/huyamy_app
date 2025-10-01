import { Locale, Product } from "@/types";
import SectionTitle from "./SectionTitle";
import ProductCard from "./ProductCard";
import { ButtonSecondary } from "./ui";
import { useLocale, useTranslations } from "next-intl";
import { currencies } from "@/data";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showButton?: boolean;
  bgColor?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  showButton = false,
  bgColor = "bg-neutral-50",
}) => {
  const t = useTranslations("products");
  const currentLocale = useLocale() as Locale;
  const currency = currencies[currentLocale];

  return (
    <div className={`${bgColor} py-16 sm:py-24`}>
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>{title}</SectionTitle>
        {subtitle && (
          <p className="text-center text-neutral-600 max-w-2xl mx-auto -mt-12 mb-12">
            {subtitle}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={currentLocale}
              currency={currency}
            />
          ))}
        </div>
        {showButton && (
          <div className="text-center mt-16">
            <ButtonSecondary>{t("viewAll")}</ButtonSecondary>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
