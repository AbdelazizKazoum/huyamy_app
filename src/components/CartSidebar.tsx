import { Locale } from "@/types";
import { Transition } from "@headlessui/react";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Fragment, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/useCartStore";
import { Checkbox } from "@/components/ui/Checkbox"; // Import custom Checkbox
import { Link } from "@/i18n/config"; // Import Link for navigation

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Locale;
  currency: string;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  lang,
  currency,
}) => {
  const t = useTranslations("cart");
  const {
    items,
    updateQuantity,
    removeItem,
    toggleItemSelected,
    toggleSelectAll,
    removeSelectedItems,
  } = useCartStore();

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce((total, item) => {
        const price = item.selectedVariant?.price ?? item.product.price;
        return total + price * item.quantity;
      }, 0),
    [selectedItems]
  );

  const isAllSelected =
    items.length > 0 && selectedItems.length === items.length;

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50" dir={lang === "ar" ? "rtl" : "ltr"}>
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
          <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
        </Transition.Child>

        {/* Cart Panel */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          // Always slide from the left
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          // Always slide to the left
          leaveTo="-translate-x-full"
        >
          <div
            className={`fixed top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col left-0`} // Always position on the left
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                {t("title")} ({items.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full"
              >
                <X size={22} />
              </button>
            </div>

            {items.length > 0 ? (
              <>
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="sidebar-select-all"
                        checked={isAllSelected}
                        onCheckedChange={(checked) =>
                          toggleSelectAll(!!checked)
                        }
                      />
                      <label
                        htmlFor="sidebar-select-all"
                        className="font-medium text-sm text-slate-700"
                      >
                        {isAllSelected ? t("deselectAll") : t("selectAll")}
                      </label>
                    </div>
                    {selectedItems.length > 0 && (
                      <button
                        onClick={() => removeSelectedItems()}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        <Trash2 size={14} />
                        {t("remove")}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {items.map((item) => {
                    const itemPrice =
                      item.selectedVariant?.price ?? item.product.price;
                    const itemImage =
                      item.selectedVariant?.images?.[0] ?? item.product.image;
                    const productName =
                      item.product.name[lang] ||
                      item.product.name.ar ||
                      "Product";
                    return (
                      <div
                        key={item.cartItemId}
                        className="flex items-start gap-4"
                      >
                        <Checkbox
                          className="mt-1"
                          checked={item.selected}
                          onCheckedChange={() =>
                            toggleItemSelected(item.cartItemId)
                          }
                        />
                        <Image
                          src={itemImage}
                          alt={productName}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-md border border-slate-200"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                            {productName}
                          </h3>
                          {/* Variant Options */}
                          {item.selectedVariant && (
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                              {Object.entries(item.selectedVariant.options).map(
                                ([optionKey, optionValue]) => {
                                  const variantOption =
                                    item.product.variantOptions?.find(
                                      (opt) =>
                                        opt.name.fr === optionKey ||
                                        opt.name.ar === optionKey
                                    );
                                  const displayName = variantOption
                                    ? variantOption.name[lang]
                                    : optionKey;
                                  const isColorOption =
                                    displayName.toLowerCase() === "couleur" ||
                                    displayName.toLowerCase() === "اللون";
                                  return (
                                    <span
                                      key={optionKey}
                                      className="text-xs text-slate-500 flex items-center gap-1"
                                    >
                                      {displayName}:
                                      {isColorOption ? (
                                        <span
                                          className="inline-block w-4 h-4 rounded-full border border-slate-300"
                                          style={{
                                            backgroundColor: optionValue,
                                          }}
                                          title={optionValue}
                                        />
                                      ) : (
                                        <span className="font-medium text-slate-600">
                                          {optionValue}
                                        </span>
                                      )}
                                    </span>
                                  );
                                }
                              )}
                            </div>
                          )}
                          <p className="text-slate-500 text-xs mt-1">
                            {itemPrice.toFixed(2)} {currency}
                          </p>
                          <div className="flex items-end justify-between mt-3">
                            <div className="flex items-center border border-slate-200 rounded-md">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.cartItemId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 font-bold text-slate-800 text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.cartItemId,
                                    item.quantity + 1
                                  )
                                }
                                className="p-1.5 text-slate-500 hover:bg-slate-100"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-700 text-sm">
                                {(itemPrice * item.quantity).toFixed(2)}{" "}
                                {currency}
                              </span>
                              <button
                                onClick={() => removeItem(item.cartItemId)}
                                className="p-1 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base text-slate-600">
                      {t("subtotal")} ({selectedItems.length} {t("items")})
                    </span>
                    <span className="text-xl font-bold text-green-700">
                      {subtotal.toFixed(2)} {currency}
                    </span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="block w-full text-center bg-primary-800 text-white font-bold py-3 px-6 rounded-lg text-base border-2 border-transparent hover:bg-primary-900 transition-all duration-300"
                  >
                    {t("viewCart")}
                  </Link>
                  <Link href="/checkout" passHref>
                    <button
                      onClick={onClose}
                      className="w-full mt-3 text-center font-bold py-3 px-6 rounded-lg text-base border-2 border-slate-300 text-primary-800 hover:bg-primary-800/10 hover:border-primary-800/30 transition-all duration-300 disabled:border-slate-200 disabled:text-slate-400 disabled:bg-white disabled:cursor-not-allowed cursor-pointer"
                      disabled={selectedItems.length === 0}
                    >
                      {t("checkout")}
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <ShoppingCart size={64} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-800">
                  {t("empty.title")}
                </h3>
                <p className="text-slate-500 mt-2">{t("empty.description")}</p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-primary-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-900 transition-all duration-300"
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
