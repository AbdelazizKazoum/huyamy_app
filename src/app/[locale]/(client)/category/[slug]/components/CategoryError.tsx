"use client";

import { Locale } from "@/types";

interface CategoryErrorProps {
  locale: Locale;
}

export default function CategoryError({ locale }: CategoryErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-red-600 bg-red-50 p-8 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-2">Unable to Load Products</h2>
        <p className="mb-4">
          There was an issue loading products for this category.
        </p>
        <a
          href={`/${locale}/products`}
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Back to All Products
        </a>
      </div>
    </div>
  );
}
