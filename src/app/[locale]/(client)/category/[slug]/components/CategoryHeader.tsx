"use client";

import Image from "next/image";
import { Category, Locale } from "@/types";

interface CategoryHeaderProps {
  category: Category;
  locale: Locale;
}

export default function CategoryHeader({
  category,
  locale,
}: CategoryHeaderProps) {
  return (
    <div className="relative bg-neutral-800 text-white py-16 sm:py-24 px-4 overflow-hidden">
      {category.image && (
        <Image
          src={category.image}
          alt={category.name[locale] || "Category Image"}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-30"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-neutral-800/30 z-10" />
      <div className="container mx-auto relative z-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          {category.name[locale]}
        </h1>
        {category.description?.[locale] && (
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200 drop-shadow-md">
            {category.description[locale]}
          </p>
        )}
      </div>
    </div>
  );
}
