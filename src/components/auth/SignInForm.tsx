/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormData } from "@/lib/schemas/authSchema";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
        // Remove "auth/" prefix for translation key
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
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("auth.emailLabel")}
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          autoComplete="username"
          className={`block w-full rounded-lg border ${
            errors.email ? "border-red-400" : "border-gray-300"
          } px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition`}
          placeholder={t("auth.emailPlaceholder")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("auth.passwordLabel")}
        </label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            className={`block w-full rounded-lg border ${
              errors.password ? "border-red-400" : "border-gray-300"
            } px-4 py-2 bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition`}
            placeholder={t("auth.passwordPlaceholder")}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary-600"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? t("auth.hidePassword") : t("auth.showPassword")
            }
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
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
