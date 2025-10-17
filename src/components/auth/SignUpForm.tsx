/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/lib/schemas/authSchema";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  MapPin,
  Phone,
  Building2,
  ArrowLeft,
} from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [authError, setAuthError] = useState<string | null>(null);
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // Step 1: Personal Info
  const personalFields = (
    <>
      <div className="mb-4">
        <Input
          label={t("auth.nameLabel")}
          placeholder={t("auth.namePlaceholder")}
          error={
            errors.displayName?.message
              ? t(errors.displayName.message)
              : undefined
          }
          icon={<User size={18} className="text-slate-400" />}
          {...register("displayName")}
          id="displayName"
          autoComplete="name"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("auth.emailLabel")}
          placeholder={t("auth.emailPlaceholder")}
          error={errors.email?.message ? t(errors.email.message) : undefined}
          icon={<Mail size={18} className="text-slate-400" />}
          {...register("email")}
          id="email"
          type="email"
          autoComplete="username"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("auth.passwordLabel")}
          placeholder={t("auth.passwordPlaceholder")}
          error={
            errors.password?.message ? t(errors.password.message) : undefined
          }
          icon={<Lock size={18} className="text-slate-400" />}
          {...register("password")}
          id="password"
          type="password"
          autoComplete="new-password"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("auth.confirmPasswordLabel")}
          placeholder={t("auth.confirmPasswordPlaceholder")}
          error={
            errors.confirmPassword?.message
              ? t(errors.confirmPassword.message)
              : undefined
          }
          icon={<ShieldCheck size={18} className="text-slate-400" />}
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
        />
      </div>
    </>
  );

  // Step 2: Address Info
  const addressFields = (
    <>
      <div className="mb-4">
        <Input
          label={t("auth.addressLabel")}
          placeholder={t("auth.addressPlaceholder")}
          error={
            errors.address?.message ? t(errors.address.message) : undefined
          }
          icon={<MapPin size={18} className="text-slate-400" />}
          {...register("address")}
          id="address"
          autoComplete="street-address"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("auth.cityLabel")}
          placeholder={t("auth.cityPlaceholder")}
          error={errors.city?.message ? t(errors.city.message) : undefined}
          icon={<Building2 size={18} className="text-slate-400" />}
          {...register("city")}
          id="city"
          autoComplete="address-level2"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("auth.phoneLabel")}
          placeholder={t("auth.phonePlaceholder")}
          error={errors.phone?.message ? t(errors.phone.message) : undefined}
          icon={<Phone size={18} className="text-slate-400" />}
          {...register("phone")}
          id="phone"
          type="tel"
          autoComplete="tel"
        />
      </div>
    </>
  );

  // Handle next step
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await trigger([
      "displayName",
      "email",
      "password",
      "confirmPassword",
    ]);
    if (valid) {
      setStep(2);
    }
  };

  // Handle back to personal info
  const handleBackStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  // Handle submit (step 2 only)
  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        address: data.address,
        city: data.city,
        phone: data.phone,
      });

      toast.success(t("auth.signupSuccess") || "تم إنشاء الحساب بنجاح");
      router.push("/");
    } catch {
      setAuthError(t("auth.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={step === 2 ? handleSubmit(onSubmit) : handleNextStep}
      className="space-y-4"
      autoComplete="off"
    >
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm text-center">
          {authError}
        </div>
      )}

      {/* Render all fields, hide those not in the current step */}
      <div className={step === 1 ? "" : "hidden"}>{personalFields}</div>
      <div className={step === 2 ? "" : "hidden"}>{addressFields}</div>

      <div className="flex gap-2">
        {step === 2 && (
          <button
            type="button"
            onClick={handleBackStep}
            className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            <ArrowLeft size={16} className="text-slate-400" />
            {t("auth.backStep") || "رجوع"}
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {step === 1
            ? t("auth.nextStep")
            : isLoading
            ? t("auth.signingUp")
            : t("auth.submitBtn")}
        </button>
      </div>
    </form>
  );
}
