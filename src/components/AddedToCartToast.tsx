import { Product, Locale } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast, Toast } from "react-hot-toast";
import { X, BadgeCheck, ShoppingCart } from "lucide-react"; // Changed icon import
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/config";

interface AddedToCartToastProps {
  toastInstance: Toast;
  product: Product;
  lang: Locale;
}

const AddedToCartToast: React.FC<AddedToCartToastProps> = ({
  toastInstance,
  product,
  lang,
}) => {
  const t = useTranslations("cart");
  const { items } = useCartStore();
  const [cartItem, setCartItem] = useState<{
    quantity: number;
    price: number;
  } | null>(null);

  useEffect(() => {
    const itemInCart = items.find((item) => item.product.id === product.id);
    if (itemInCart) {
      setCartItem({
        quantity: itemInCart.quantity,
        price: itemInCart.product.price,
      });
    }
  }, [items, product.id]);

  return (
    <div
      className={`max-w-sm w-full bg-white shadow-2xl rounded-xl pointer-events-auto border border-slate-200/80 overflow-hidden transition-all duration-300 ease-in-out
      ${
        toastInstance.visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4"
      }`}
    >
      {/* Redesigned Header with New Icon and Text Style */}
      <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <BadgeCheck size={22} className="text-green-600" />
          <p className="text-md font-bold text-green-800">
            {t("addedToCartSuccess")}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(toastInstance.id)}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name[lang]}
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg object-cover border border-slate-200"
            />
          </div>
          <div className="flex-grow min-w-0">
            <p
              className="text-base font-bold text-slate-900 truncate"
              title={product.name[lang]}
            >
              {product.name[lang]}
            </p>
            {cartItem && (
              <div className="mt-1 flex justify-between items-center text-sm">
                <p className="text-slate-500">
                  {t("quantity")}:{" "}
                  <span className="font-semibold text-slate-700">
                    {cartItem.quantity}
                  </span>
                </p>
                <p className="font-bold text-primary-800">
                  {(cartItem.price * cartItem.quantity).toFixed(2)}{" "}
                  {t("currency")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => toast.dismiss(toastInstance.id)}
            className="w-full text-center px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-200 transition-colors"
          >
            {t("continueShopping")}
          </button>
          <Link
            href="/cart"
            onClick={() => toast.dismiss(toastInstance.id)}
            className="flex items-center justify-center gap-2 w-full text-center px-4 py-2.5 bg-primary-800 text-white font-semibold rounded-lg text-sm hover:bg-primary-900 transition-colors"
          >
            <ShoppingCart size={16} />
            {t("viewCart")}
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      {toastInstance.visible && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 w-full animate-progress origin-left"></div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default AddedToCartToast;
