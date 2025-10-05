"use client";

import { usePathname } from "next/navigation";
import { Language, Product, Category } from "@/types";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface UseBreadcrumbProps {
  lang: Language;
  product?: Product;
  category?: Category;
}

export const useBreadcrumb = ({
  lang,
  product,
  category,
}: UseBreadcrumbProps) => {
  const pathname = usePathname();

  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    // Always start with home
    items.push({
      label: lang === "ar" ? "الرئيسية" : "Accueil",
      href: `/${lang}`,
    });

    // Parse pathname to get segments
    const pathSegments = pathname.split("/").filter(Boolean);
    const segments = pathSegments.slice(1); // Remove locale

    // Build breadcrumb based on segments and context
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;

      switch (segment) {
        case "products":
          if (!isLast || !product) {
            items.push({
              label: lang === "ar" ? "المنتجات" : "Produits",
              href: `/${lang}/products`,
              isCurrentPage: isLast && !product,
            });
          }
          break;

        case "categories":
          if (!isLast || !category) {
            items.push({
              label: lang === "ar" ? "الفئات" : "Catégories",
              href: `/${lang}/categories`,
              isCurrentPage: isLast && !category,
            });
          }
          break;

        default:
          // Handle dynamic routes
          if (isLast) {
            if (product) {
              // Add category breadcrumb if product has category
              if (product.category) {
                items.push({
                  label: product.category.name[lang],
                  href: `/${lang}/categories/${product.category.id}`,
                });
              }
              // Add product breadcrumb
              items.push({
                label: product.name[lang],
                href: `/${lang}/products/${product.slug}`,
                isCurrentPage: true,
              });
            } else if (category) {
              items.push({
                label: category.name[lang],
                href: `/${lang}/categories/${category.id}`,
                isCurrentPage: true,
              });
            }
          }
          break;
      }
    }

    return items;
  };

  return {
    items: generateBreadcrumbItems(),
    pathname,
  };
};
