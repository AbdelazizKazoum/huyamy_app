import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-gray-400">📦</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <Link
            href="/products"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
