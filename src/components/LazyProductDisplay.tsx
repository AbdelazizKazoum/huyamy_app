"use client";

import { Suspense, lazy } from "react";
import { Language, Product, Section, SiteConfig } from "@/types";
import ProductDisplaySkeleton from "./ProductDisplaySkeleton";

// Lazy load the ProductDisplay component
const ProductDisplay = lazy(() => import("./ProductDisplay"));

interface LazyProductDisplayProps {
  product: Product;
  locale: Language;
  alsoChooseSections?: Section[];
  config?: SiteConfig | null;
}

const LazyProductDisplay: React.FC<LazyProductDisplayProps> = ({
  product,
  locale,
  alsoChooseSections = [],
  config,
}) => {
  return (
    <Suspense fallback={<ProductDisplaySkeleton />}>
      <ProductDisplay
        product={product}
        locale={locale}
        alsoChooseSections={alsoChooseSections}
        config={config}
      />
    </Suspense>
  );
};

export default LazyProductDisplay;
