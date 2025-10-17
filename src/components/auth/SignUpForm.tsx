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
  const t = useTranslations("auth");

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // <-- Add this line for real-time validation
  });

  // Step 1: Personal Info
  const personalFields = (
    <>
      <div className="mb-4">
        <Input
          label={t("nameLabel")}
          placeholder={t("namePlaceholder")}
          error={errors.displayName?.type ? t("nameRequired") : undefined}
          icon={<User size={18} className="text-slate-400" />}
          {...register("displayName")}
          id="displayName"
          autoComplete="name"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          error={errors.email?.type ? t("emailRequired") : undefined}
          icon={<Mail size={18} className="text-slate-400" />}
          {...register("email")}
          id="email"
          type="email"
          autoComplete="username"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          error={
            errors.password?.type === "min"
              ? t("passwordTooShort")
              : errors.password?.type
              ? t("passwordRequired")
              : undefined
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
          label={t("confirmPasswordLabel")}
          placeholder={t("confirmPasswordPlaceholder")}
          error={
            errors.confirmPassword?.type === "validate"
              ? t("passwordsDontMatch")
              : errors.confirmPassword?.type
              ? t("confirmPasswordRequired")
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
          label={t("addressLabel")}
          placeholder={t("addressPlaceholder")}
          error={errors.address?.type ? t("addressRequired") : undefined}
          icon={<MapPin size={18} className="text-slate-400" />}
          {...register("address")}
          id="address"
          autoComplete="street-address"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("cityLabel")}
          placeholder={t("cityPlaceholder")}
          error={errors.city?.type ? t("cityRequired") : undefined}
          icon={<Building2 size={18} className="text-slate-400" />}
          {...register("city")}
          id="city"
          autoComplete="address-level2"
        />
      </div>
      <div className="mb-4">
        <Input
          label={t("phoneLabel")}
          placeholder={t("phonePlaceholder")}
          error={errors.phone?.type ? t("phoneRequired") : undefined}
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
      // signUp returns void, so don't test its return value — rely on exceptions for errors
      await signUp(data);
      router.push("/");
    } catch (err) {
      const code = (err as any)?.code;
      const errorKey = code.replace(/^auth\//, "");
      setAuthError(t(errorKey));
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
            {t("backStep")}
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {step === 1
            ? t("nextStep")
            : isLoading
            ? t("signingUp")
            : t("submitBtn")}
        </button>
      </div>
    </form>
  );
}
