"use client";

import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { OrderData } from "@/types/order";
import { toast } from "react-hot-toast";
import {
  User,
  Phone,
  MapPin,
  Home,
  Mail,
  ClipboardList,
  Truck,
  Wallet,
  Contact,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";
import { ButtonPrimary } from "@/components/ui";
import SuccessModal from "@/components/modals/CheckoutSuccessModal";
import { Language } from "@/types";
import { Link } from "@/i18n/config";

// Define validation schema with Zod
const createShippingSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z.string().min(3, t("fullNameRequired")),
    phone: z.string().min(10, t("phoneRequired")),
    city: z.string().min(2, t("cityRequired")),
    address: z.string().min(5, t("addressRequired")),
    email: z.string().email(t("emailInvalid")).optional().or(z.literal("")),
  });

type ShippingFormData = z.infer<ReturnType<typeof createShippingSchema>>;

const CheckoutPage = () => {
  const t = useTranslations("checkout");
  const tValidation = useTranslations("checkout.validation");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Language;

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true); // Add this state

  // Add useEffect to handle hydration
  useEffect(() => {
    setIsHydrating(false);
  }, []);

  // 1. Get all items, but derive selected items for this page
  const allItems = useCartStore((state) => state.items);
  const { clearCart } = useCartStore();

  const { createOrder, loading: isCreatingOrder } = useOrderStore();

  // 2. Use only selected items for all calculations and display
  const items = useMemo(
    () => allItems.filter((item) => item.selected),
    [allItems]
  );

  const shippingSchema = createShippingSchema(tValidation);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  const subtotal = useMemo(
    () =>
      items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items]
  );

  const onSubmit = async (data: ShippingFormData) => {
    const orderData: OrderData = {
      shippingInfo: data,
      products: items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      totalAmount: subtotal,
      locale: locale,
      orderDate: new Date().toISOString(),
    };

    try {
      await createOrder(orderData);
      clearCart();
      setIsSuccessModalOpen(true); // This will now correctly show the modal
    } catch (error) {
      toast.error(t("orderErrorToast"));
      console.error("Failed to create order:", error);
    }
  };

  // Loading Skeleton UI
  if (isHydrating) {
    return (
      <div className="bg-white">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Skeleton */}
          <div className="mb-12 ltr:text-left rtl:text-right">
            <div className="h-10 w-1/3 bg-slate-200 rounded-lg animate-pulse mb-3"></div>
            <div className="h-6 w-1/2 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:items-start">
            {/* Form Skeleton (Left Column) */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80">
              {/* Form Title Skeleton */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>

              {/* Form Fields Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                {/* Phone */}
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                {/* City */}
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                {/* Address */}
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                {/* Email */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Summary Skeleton (Right Column) */}
            <div className="lg:col-span-5 mt-10 lg:mt-0">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80">
                {/* Summary Title Skeleton */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                  <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Items Skeleton */}
                <div className="space-y-4 mb-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="h-16 w-16 bg-slate-200 rounded-lg animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Summary Details Skeleton */}
                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <div className="h-5 w-12 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Button Skeleton */}
                <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Show an empty cart message if there are no items and the modal isn't open
  if (items.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
          <ShoppingBag size={48} className="text-slate-400" strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-800">
          {t("empty.title")}
        </h1>
        <p className="mt-2 text-lg text-slate-500">{t("empty.description")}</p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-primary-800 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary-900 transition-all duration-300"
        >
          {t("empty.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 ltr:text-left rtl:text-right">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-2 text-lg text-slate-600">{t("pageSubtitle")}</p>
          </div>

          {/* Added lg:items-start to prevent columns from stretching */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:items-start">
            {/* Shipping Information Form (Left Column) */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Contact className="h-6 w-6 text-primary-800" />
                {t("shippingTitle")}
              </h2>
              <form
                id="shipping-form"
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6"
              >
                <div>
                  <Input
                    label={`${t("fullName")} *`}
                    icon={<User className="h-4 w-4 text-slate-400" />}
                    {...register("fullName")}
                    error={errors.fullName?.message}
                  />
                </div>
                <div>
                  <Input
                    label={`${t("phone")} *`}
                    icon={<Phone className="h-4 w-4 text-slate-400" />}
                    {...register("phone")}
                    error={errors.phone?.message}
                  />
                </div>
                <div>
                  <Input
                    label={`${t("city")} *`}
                    icon={<MapPin className="h-4 w-4 text-slate-400" />}
                    {...register("city")}
                    error={errors.city?.message}
                  />
                </div>
                <div>
                  <Input
                    label={`${t("address")} *`}
                    icon={<Home className="h-4 w-4 text-slate-400" />}
                    {...register("address")}
                    error={errors.address?.message}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label={`${t("email")} (${t("optional")})`}
                    icon={<Mail className="h-4 w-4 text-slate-400" />}
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>
              </form>
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-5 mt-10 lg:mt-0">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80 lg:sticky lg:top-24">
                <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4 flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-primary-800" />
                  {t("summaryTitle")}
                </h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={`checkout-item-${item.product.id}-${index}`} // Use combination of product ID and index
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name["ar"]}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-slate-800">
                          {item.product.name["ar"]}
                        </p>
                        <p className="text-sm text-slate-500">
                          {t("quantityLabel")}: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-slate-800 whitespace-nowrap">
                        {(item.product.price * item.quantity).toFixed(2)}{" "}
                        {t("currency")}
                      </p>
                    </div>
                  ))}
                </div>
                <dl className="space-y-3 text-slate-600 border-t border-slate-200 mt-4 pt-4">
                  <div className="flex items-center justify-between font-medium">
                    <dt className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-slate-500" />
                      {t("subtotal")}
                    </dt>
                    <dd className="text-slate-800">
                      {subtotal.toFixed(2)} {t("currency")}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <dt className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-slate-500" />
                      {t("shipping")}
                    </dt>
                    <dd className="text-slate-800">{t("cod")}</dd>
                  </div>
                  <div className="flex items-center justify-between text-xl font-bold border-t border-slate-200 pt-4 mt-4">
                    <dt className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-slate-800" />
                      {t("total")}
                    </dt>
                    <dd className="text-primary-800">
                      {subtotal.toFixed(2)} {t("currency")}
                    </dd>
                  </div>
                </dl>

                {/* Keep the button in the summary */}
                <ButtonPrimary
                  type="submit"
                  form="shipping-form" // This connects to the form by ID
                  disabled={isCreatingOrder || items.length === 0}
                  className="w-full text-lg py-3 mt-6"
                >
                  {isCreatingOrder ? t("placingOrder") : t("placeOrder")}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push(`/${locale}/products`); // Navigate away after closing modal
        }}
        message={t("orderSuccessMessage")}
        lang={locale}
      />
    </>
  );
};

export default CheckoutPage;
