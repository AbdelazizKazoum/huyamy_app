import { Language, Product } from "@/types";
import SectionTitle from "./SectionTitle";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  lang?: Language;
  currency?: string;
  showButton?: boolean;
  bgColor?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  lang = "ar",
  currency = "د.م.",
  showButton = false,
  bgColor = "bg-stone-50",
}) => {
  return (
    <div className={`${bgColor} py-16 sm:py-24`}>
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>{title}</SectionTitle>
        {subtitle && (
          <p className="text-center text-gray-600 max-w-2xl mx-auto -mt-12 mb-12">
            {subtitle}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              currency={currency}
            />
          ))}
        </div>
        {showButton && (
          <div className="text-center mt-16">
            <button className="bg-green-800 text-white font-bold py-3 px-10 rounded-full hover:bg-green-900 transition-all duration-300 shadow-md">
              عرض كل المنتجات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
