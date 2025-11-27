"use client";

import { Suspense, lazy } from "react";
import { Locale, Product } from "@/types";
import ProductCardSkeleton from "./ProductCardSkeleton";

// Lazy load the ProductCard component
const ProductCard = lazy(() => import("./ProductCard"));

interface LazyProductCardProps {
  product: Product;
  lang?: Locale;
  currency?: string;
}

const LazyProductCard: React.FC<LazyProductCardProps> = ({
  product,
  lang,
  currency,
}) => {
  return (
    <Suspense fallback={<ProductCardSkeleton />}>
      <ProductCard product={product} lang={lang} currency={currency} />
    </Suspense>
  );
};

export default LazyProductCard;
