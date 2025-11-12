"use client";

import { ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/config";

interface EmptyCartMessageProps {
  t: (key: string) => string;
}

export default function EmptyCartMessage({ t }: EmptyCartMessageProps) {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
        <ShoppingCart size={48} className="text-slate-400" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-slate-800">
        {t("empty.title")}
      </h1>
      <p className="mt-2 text-lg text-slate-500">{t("empty.description")}</p>
      <Link
        href="/products"
        className="mt-8 inline-block bg-primary-800 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary-900 transition-all duration-300"
      >
        {t("empty.startShopping")}
      </Link>
    </div>
  );
}
