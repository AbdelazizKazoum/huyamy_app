import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            إنشاء حساب جديد
          </h2>
        </div>
        <SignUpForm />
        <div className="text-center">
          <Link
            href="/signin"
            className="text-primary-600 hover:text-primary-500"
          >
            لديك حساب؟ سجل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
