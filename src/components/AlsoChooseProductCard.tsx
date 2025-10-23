import Image from "next/image";
import { Product, Locale } from "@/types";
import { ButtonPrimary } from "./ui";
import { Link } from "@/i18n/config";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import AddedToCartToast from "./AddedToCartToast";

interface AlsoChooseProductCardProps {
  product: Product;
  lang: Locale;
}

const AlsoChooseProductCard: React.FC<AlsoChooseProductCardProps> = ({
  product,
  lang,
}) => {
  const colorOption = product.variantOptions?.find(
    (opt) => opt.name[lang] === "اللون" || opt.name.fr === "Couleur"
  );
  const colorValues = colorOption?.values || [];

  const { addItem } = useCartStore();

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

  return (
    <div className="min-w-[220px] max-w-[220px] bg-white rounded-xl shadow-md border border-neutral-200 flex flex-col items-center p-3 scale-90 transition-all duration-300 hover:scale-95 relative">
      <Link
        href={`/products/${product.slug}`}
        className="w-full flex flex-col items-center"
        onClick={(e) => e.preventDefault()} // Prevent redirect on card click
      >
        <div className="relative w-full">
          <Image
            src={product.image}
            alt={product.name[lang] || product.name.fr}
            width={180}
            height={100}
            className="w-full h-24 object-cover rounded-lg mb-2"
          />
          {/* Color swatches overlayed near the bottom of the image */}
          {colorValues.length > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex flex-row gap-1 z-10">
              {colorValues.map((color: string) => (
                <span
                  key={color}
                  className="w-4 h-4 rounded-full border border-neutral-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
        <h3 className="text-base font-semibold text-neutral-800 text-center mb-1 line-clamp-2">
          {product.name[lang] || product.name.fr}
        </h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-primary-900 font-bold text-sm">
            {product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-neutral-400 line-through text-xs">
              {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <ButtonPrimary
          className="w-full mt-2 text-xs py-1"
          onClick={handleAddToCart}
        >
          {lang === "ar" ? "أضف إلى السلة" : "Ajouter au panier"}
        </ButtonPrimary>
      </Link>
    </div>
  );
};

export default AlsoChooseProductCard;
