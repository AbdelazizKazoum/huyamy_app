import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { Product, Locale } from "@/types";
import { CheckCircle, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
// REMOVED: useCartStore is no longer needed here
import { Link } from "@/i18n/config";

interface AddedToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  lang: Locale;
}

const AddedToCartModal: React.FC<AddedToCartModalProps> = ({
  isOpen,
  onClose,
  product,
  quantity,
  lang,
}) => {
  const t = useTranslations();

  // Calculate subtotal based ONLY on the product just added
  const subtotal = product.price * quantity;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          // This empty function prevents the dialog from closing on outside clicks.
          // The buttons inside the modal will still use the `onClose` prop to close it.
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 p-1 text-slate-400 hover:text-slate-800 ltr:right-4 rtl:left-4"
                >
                  <X size={24} />
                </button>

                <div className="mt-4 text-center">
                  <CheckCircle size={48} className="mx-auto text-green-500" />
                  <Dialog.Title
                    as="h3"
                    className="mt-4 text-2xl font-bold leading-6 text-slate-900"
                  >
                    {t("cart.addedSuccessTitle")}
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-slate-500">
                    {t("cart.addedSuccessSubtitle")}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg flex items-center gap-4 border border-slate-200 ltr:text-left rtl:text-right">
                  <Image
                    src={product.image}
                    alt={product.name[lang]}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-bold text-slate-800">
                      {product.name[lang]}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {t("cart.quantity")}:{" "}
                      <span className="font-semibold text-slate-700">
                        {quantity}
                      </span>
                    </p>
                    <p className="mt-1 font-semibold text-primary-800">
                      {product.price.toFixed(2)} {t("cart.currency")}
                    </p>
                  </div>
                </div>

                {/* Updated to show only the subtotal of the added item */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-center text-slate-600">
                    <span>
                      {t("cart.subtotal")}:{" "}
                      <span className="font-bold text-slate-900">
                        {subtotal.toFixed(2)} {t("cart.currency")}
                      </span>
                    </span>
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                    onClick={onClose}
                  >
                    {t("cart.continueShopping")}
                  </button>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="inline-flex justify-center items-center gap-2 rounded-md bg-primary-800 px-4 py-3 text-sm font-bold text-white hover:bg-primary-900 focus:outline-none"
                  >
                    <ShoppingCart size={16} />
                    {t("cart.viewCart")}
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddedToCartModal;
