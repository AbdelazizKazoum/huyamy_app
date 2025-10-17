import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const t = useTranslations();

  return (
    <main className="min-h-[calc(100vh-80px)] pt-[80px] flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-100 py-12 px-4">
      <section className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <header className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("auth.signupTitle")}
          </h2>
          <p className="text-sm text-gray-500">{t("auth.signupSubtitle")}</p>
        </header>
        <SignUpForm />
        <footer className="text-center pt-4 border-t border-gray-100">
          <Link
            href="/signin"
            className="text-primary-600 hover:text-primary-700 font-medium transition"
          >
            {t("auth.haveAccount")}
          </Link>
        </footer>
      </section>
    </main>
  );
}
