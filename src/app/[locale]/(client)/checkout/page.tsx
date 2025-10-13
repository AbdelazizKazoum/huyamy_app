"use client";

import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { OrderData } from "@/types/order";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui";

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

  const { items, clearCart } = useCartStore();
  const { createOrder, loading: isCreatingOrder } = useOrderStore();

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

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

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
      locale: "ar", // Or get from params
      orderDate: new Date().toISOString(),
    };

    try {
      await createOrder(orderData);
      toast.success(t("orderSuccessToast"));
      clearCart();
      router.push("/order-success"); // Redirect to a success page
    } catch (error) {
      toast.error(t("orderErrorToast"));
      console.error("Failed to create order:", error);
    }
  };

  if (items.length === 0) {
    return null; // Or a loading spinner, as redirect is handling it
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 ltr:text-left rtl:text-right">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-lg text-slate-600">{t("pageSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
          {/* Shipping Information Form (Left Column) */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {t("shippingTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
              <div className="sm:col-span-2">
                <Input
                  label={t("fullName")}
                  {...register("fullName")}
                  error={errors.fullName?.message}
                />
              </div>
              <div>
                <Input
                  label={t("phone")}
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </div>
              <div>
                <Input
                  label={t("city")}
                  {...register("city")}
                  error={errors.city?.message}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label={t("address")}
                  {...register("address")}
                  error={errors.address?.message}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label={`${t("email")} (${t("optional")})`}
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="w-full text-lg py-3 mt-4"
                >
                  {isCreatingOrder ? t("placingOrder") : t("placeOrder")}
                </Button>
              </div>
            </div>
          </form>

          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200/80 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-4">
                {t("summaryTitle")}
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start gap-4">
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
              <dl className="space-y-3 text-slate-600 border-t mt-4 pt-4">
                <div className="flex justify-between font-medium">
                  <dt>{t("subtotal")}</dt>
                  <dd className="text-slate-800">
                    {subtotal.toFixed(2)} {t("currency")}
                  </dd>
                </div>
                <div className="flex justify-between font-medium">
                  <dt>{t("shipping")}</dt>
                  <dd className="text-slate-800">{t("cod")}</dd>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
                  <dt className="text-slate-900">{t("total")}</dt>
                  <dd className="text-primary-800">
                    {subtotal.toFixed(2)} {t("currency")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
