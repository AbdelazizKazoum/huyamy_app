"use client";

import { useState } from "react";
import { Product, Language, ProductVariant } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import AddedToCartModal from "./AddedToCartModal";

interface AddToCartFormProps {
  product: Product;
  lang: Language;
  selectedVariant: ProductVariant | null;
}

const AddToCartForm: React.FC<AddToCartFormProps> = ({
  product,
  lang,
  selectedVariant,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addItem } = useCartStore();
  const t = useTranslations();

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    // Pass the selected variant to the addItem function
    addItem(product, quantity, selectedVariant);
    setIsModalOpen(true);

    setTimeout(() => {3+3
      setIsSubmitting(false);
    }, 1000);
  };

  // Determine the correct product details for the modal
  const modalProductDetails = {
    ...product,
    // Just use the product name, don't append variant options
    name: product.name,
    price: selectedVariant?.price ?? product.price,
    image: selectedVariant?.images?.[0] ?? product.image,
  };

  return (
    <>
      {/* Add the animations styles from SubmitButton */}
      <style jsx>{`
        @keyframes ring {
          0% {
            transform: rotate(0);
          }
          1% {
            transform: rotate(15deg);
          }
          3% {
            transform: rotate(-14deg);
          }
          5% {
            transform: rotate(17deg);
          }
          7% {
            transform: rotate(-16deg);
          }
          9% {
            transform: rotate(15deg);
          }
          11% {
            transform: rotate(-14deg);
          }
          13% {
            transform: rotate(13deg);
          }
          15% {
            transform: rotate(-12deg);
          }
          17% {
            transform: rotate(12deg);
          }
          19% {
            transform: rotate(-10deg);
          }
          21% {
            transform: rotate(9deg);
          }
          23% {
            transform: rotate(-8deg);
          }
          25% {
            transform: rotate(7deg);
          }
          27% {
            transform: rotate(-5deg);
          }
          29% {
            transform: rotate(5deg);
          }
          31% {
            transform: rotate(-4deg);
          }
          33% {
            transform: rotate(3deg);
          }
          35% {
            transform: rotate(-2deg);
          }
          37% {
            transform: rotate(1deg);
          }
          39% {
            transform: rotate(-1deg);
          }
          41% {
            transform: rotate(1deg);
          }
          43% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(0);
          }
        }
        .animate-ring {
          animation: ring 3s ease-in-out 0.7s infinite;
        }

        @keyframes slide-right-left {
          0%,
          100% {
            transform: translateX(5px);
          }
          50% {
            transform: translateX(-5px);
          }
        }
        .animate-slide {
          animation: slide-right-left 2.5s ease-in-out infinite;
        }

        @keyframes shiny-effect {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          100% {
            transform: translateX(250%) skewX(-25deg);
          }
        }
        .animate-shiny::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shiny-effect 3s infinite linear;
        }
      `}</style>

      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              {t("cart.quantity")}
            </label>
            <div className="flex items-center border border-slate-300 rounded-lg bg-white">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-3 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
                aria-label={t("products.decreaseQuantity")}
              >
                <Minus size={16} />
              </button>
              <span className="flex-grow text-center text-lg font-bold text-slate-800">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-3 text-slate-500 hover:bg-slate-100 rounded-r-md"
                aria-label={t("products.increaseQuantity")}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-primary-800 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-primary-900 transition-all duration-300 disabled:bg-neutral-400 disabled:cursor-not-allowed sm:self-end relative overflow-hidden cursor-pointer animate-slide animate-shiny"
          >
            <ShoppingCart size={22} className="animate-ring" />
            {t("products.addToCart")}
          </button>
        </div>
      </div>

      {/* Render the modal */}
      <AddedToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProductDetails}
        quantity={quantity}
        lang={lang}
        selectedVariant={selectedVariant} // Pass the variant
      />
    </>
  );
};

export default AddToCartForm;
