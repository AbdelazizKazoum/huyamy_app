"use client";

import { useState } from "react";
import { Product, Locale } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import AddedToCartModal from "./AddedToCartModal"; // Import the new modal

interface AddToCartFormProps {
  product: Product;
  lang: Locale;
}

const AddToCartForm: React.FC<AddToCartFormProps> = ({ product, lang }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const { addItem } = useCartStore();
  const t = useTranslations();

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsModalOpen(true); // Open the modal
  };

  return (
    <>
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
            className="w-full flex items-center justify-center gap-3 bg-primary-800 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-primary-900 transition-all duration-300 disabled:bg-neutral-400 disabled:cursor-not-allowed sm:self-end"
          >
            <ShoppingCart size={22} />
            {t("products.addToCart")}
          </button>
        </div>
      </div>

      {/* Render the modal */}
      <AddedToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        quantity={quantity}
        lang={lang}
      />
    </>
  );
};

export default AddToCartForm;
