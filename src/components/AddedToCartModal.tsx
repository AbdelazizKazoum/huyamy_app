import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { Product, Locale, ProductVariant, Section } from "@/types";
import { CheckCircle, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
// REMOVED: useCartStore is no longer needed here
import { Link } from "@/i18n/config";
import { AlsoChooseSection } from "./AlsoChooseSection";

interface AddedToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  lang: Locale;
  selectedVariant?: ProductVariant | null;
  alsoChooseSections?: Section[]; // <-- Add this prop
}

const AddedToCartModal: React.FC<AddedToCartModalProps> = ({
  isOpen,
  onClose,
  product,
  quantity,
  lang,
  selectedVariant,
  alsoChooseSections = [],
}) => {
  const t = useTranslations();

  // Log alsoChooseSections to the console
  console.log("alsoChooseSections:", alsoChooseSections);

  // Calculate subtotal based ONLY on the product just added
  const subtotal = product.price * quantity;

  // Determine direction for RTL/LTR
  const isRTL = lang === "ar";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed inset-0 z-50 flex ${
          isRTL ? "justify-start" : "justify-end"
        } items-center`}
        onClose={onClose}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Overlay with fade-in transition */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal panel with smooth slide-in from right */}
        <Transition.Child
          as={Fragment}
          enter="transition-transform duration-300"
          enterFrom={
            isRTL ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"
          }
          enterTo="translate-x-0 opacity-100"
          leave="transition-transform duration-200"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo={
            isRTL ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"
          }
        >
          <Dialog.Panel
            className={`w-full max-w-lg h-full overflow-y-auto transform rounded-${
              isRTL ? "r" : "l"
            }-2xl bg-white p-6 shadow-xl transition-all relative`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 p-1 text-slate-400 hover:text-slate-800 ${
                isRTL ? "left-4" : "right-4"
              }`}
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
                <p className="font-bold text-slate-800">{product.name[lang]}</p>
                {/* Show variant options inline with quantity */}
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                  {selectedVariant &&
                    Object.entries(selectedVariant.options).map(
                      ([optionKey, value]) => {
                        // Find the option object from product.variantOptions
                        const optionObj = product.variantOptions?.find(
                          (opt) =>
                            opt.name.fr === optionKey ||
                            opt.name.ar === optionKey
                        );
                        const optionName = optionObj?.name[lang] || optionKey;
                        return (
                          <span
                            key={optionKey}
                            className="flex items-center gap-1"
                          >
                            <span className="font-semibold">{optionName}:</span>
                            {/* If it's a color, show a color swatch */}
                            {optionName.toLowerCase() === "couleur" ||
                            optionName.toLowerCase() === "اللون" ? (
                              <span
                                className="inline-block w-4 h-4 rounded-full border border-slate-300"
                                style={{ backgroundColor: value }}
                                title={value}
                              />
                            ) : (
                              <span>{value}</span>
                            )}
                          </span>
                        );
                      }
                    )}
                  {/* Quantity inline */}
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">{t("cart.quantity")}:</span>
                    <span className="text-slate-700">{quantity}</span>
                  </span>
                </div>
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

            {/* Show the AlsoChooseSection component if available */}
            {alsoChooseSections?.[0] && (
              <AlsoChooseSection section={alsoChooseSections[0]} lang={lang} />
            )}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default AddedToCartModal;
