import { CartItem, Locale } from "@/types";
import { Transition } from "@headlessui/react";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  lang: Locale;
  currency: string;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  lang,
  currency,
}) => {
  const t = useTranslations("cart");

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
        </Transition.Child>

        {/* Cart Panel */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2
                className="text-2xl font-bold text-neutral-800"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {t("title")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {items.length > 0 ? (
              <>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name[lang || "ar"]}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-md border border-neutral-200"
                        style={{ width: "80px", height: "80px" }}
                        unoptimized={false}
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-neutral-800">
                          {item.product.name[lang || "ar"]}
                        </h3>
                        <p className="text-primary-800 text-sm font-semibold">
                          {item.product.price.toFixed(2)} {currency}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center border border-neutral-200 rounded-full">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-r-full"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 text-lg font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-l-full"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="mr-auto p-2 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-neutral-600">
                      {t("subtotal")}
                    </span>
                    <span className="text-2xl font-bold text-primary-800">
                      {subtotal.toFixed(2)} {currency}
                    </span>
                  </div>
                  <button className="w-full bg-primary-800 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-primary-900 transition-all duration-300">
                    {t("checkout")}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full text-center mt-3 text-primary-800 font-semibold hover:underline"
                  >
                    {t("continueShopping")}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <ShoppingCart size={64} className="text-neutral-300 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-800">
                  {t("empty.title")}
                </h3>
                <p className="text-neutral-500 mt-2">
                  {t("empty.description")}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-primary-800 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-900 transition-all duration-300"
                >
                  {t("empty.startShopping")}
                </button>
              </div>
            )}
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default CartSidebar;
