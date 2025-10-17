/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormData } from "@/lib/schemas/authSchema";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const errorCode = await signIn(data.email, data.password);
      if (errorCode) {
        const key = errorCode.replace("auth/", "");
        setAuthError(t(`auth.${key}`));
        return;
      }

      const redirect = searchParams.get("redirect");
      if (redirect) {
        router.replace(redirect);
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      setAuthError(t("auth.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      autoComplete="off"
    >
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm text-center">
          {authError}
        </div>
      )}

      <div>
        <Input
          label={t("auth.emailLabel")}
          placeholder={t("auth.emailPlaceholder")}
          error={
            errors.email?.message
              ? t(`auth.${errors.email.message}`)
              : undefined
          }
          icon={<Mail size={18} className="text-slate-400" />}
          {...register("email")}
          id="email"
          type="email"
          autoComplete="username"
        />
      </div>

      <div>
        <Input
          label={t("auth.passwordLabel")}
          placeholder={t("auth.passwordPlaceholder")}
          error={
            errors.password?.message
              ? t(`auth.${errors.password.message}`)
              : undefined
          }
          icon={<Lock size={18} className="text-slate-400" />}
          {...register("password")}
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          rightIcon={
            <button
              type="button"
              tabIndex={-1}
              className="flex items-center text-gray-400 hover:text-primary-600"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? t("auth.hidePassword") : t("auth.showPassword")
              }
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/forgot-password"
          className="text-xs text-primary-600 hover:underline"
        >
          {t("auth.forgotPassword")}
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg text-white bg-primary-800 hover:bg-primary-700 font-semibold text-base transition disabled:opacity-50 shadow"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            {t("auth.signingIn")}
          </span>
        ) : (
          t("auth.signinBtn")
        )}
      </button>
    </form>
  );
}
