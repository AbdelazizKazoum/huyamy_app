"use client";

import { Contact, User, Phone, MapPin, Home, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface ShippingFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  email?: string;
}

interface ShippingFormProps {
  t: (key: string) => string;
  register: UseFormRegister<ShippingFormData>;
  errors: FieldErrors<ShippingFormData>;
}

export default function ShippingForm({
  t,
  register,
  errors,
}: ShippingFormProps) {
  return (
    <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <Contact className="h-6 w-6 text-primary-800" />
        {t("shippingTitle")}
      </h2>
      <form
        id="shipping-form"
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
  );
}
