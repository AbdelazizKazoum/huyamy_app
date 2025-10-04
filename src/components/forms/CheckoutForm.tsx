"use client";

import { Language } from "@/types";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { createOrderAction } from "@/lib/actions/order";

const initialState = {
  message: "",
  errors: {},
};

// A separate component for the button to use the `useFormStatus` hook.
const SubmitButton = ({ lang }: { lang: Language }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-800 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-green-900 transition-all duration-300 relative overflow-hidden disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      <span className="flex items-center justify-center">
        {pending ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            {lang === "ar" ? "جاري الإرسال..." : "Processing..."}
          </>
        ) : (
          <>
            {lang === "ar"
              ? "إشتر الآن و إدفع عند الإستلام"
              : "Achetez maintenant et payez à la livraison"}
            <ShoppingCart
              className={
                lang === "ar" ? "mr-3 animate-ring" : "ml-3 animate-ring"
              }
              size={24}
            />
          </>
        )}
      </span>
    </button>
  );
};

export const CheckoutForm: React.FC<{ lang: Language }> = ({ lang }) => {
  const [state, formAction] = useActionState(createOrderAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Effect to reset the form after a successful submission
  useEffect(() => {
    if (state.message && !state.errors) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="bg-white p-6 rounded-3xl shadow-2xl border-[5px] border-green-700 space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-800">
          {lang === "ar" ? "معلومات الزبون" : "Informations client"}
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <input
              type="text"
              name="fullName" // Name must match schema
              placeholder={
                lang === "ar" ? "الاسم الكامل 🧑🏻‍" : "Prénom et Nom 🧑🏻‍"
              }
              className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
            />
            {state.errors?.fullName && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {state.errors.fullName[0]}
              </p>
            )}
          </div>
          <div className="w-full">
            <input
              type="text"
              name="phone" // Name must match schema
              placeholder={lang === "ar" ? "الهاتف 📞" : "Téléphone 📞"}
              className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
            />
            {state.errors?.phone && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {state.errors.phone[0]}
              </p>
            )}
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address" // Name must match schema
            placeholder={lang === "ar" ? "العنوان 🏡" : "Adresse 🏡"}
            className="w-full p-3 rounded-xl bg-transparent border-2 border-dashed border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 text-center"
          />
          {state.errors?.address && (
            <p className="text-red-500 text-sm mt-1 text-center">
              {state.errors.address[0]}
            </p>
          )}
        </div>
      </div>

      <SubmitButton lang={lang} />

      <div className="text-center font-semibold h-6">
        {state.message && !state.errors && (
          <p className="text-green-600">{state.message}</p>
        )}
        {state.message && state.errors && (
          <p className="text-red-500">{state.message}</p>
        )}
      </div>
    </form>
  );
};

export default CheckoutForm;
