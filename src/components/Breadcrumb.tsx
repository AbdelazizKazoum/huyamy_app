"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Language, Product, Category } from "@/types";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  lang: Language;
  product?: Product;
  category?: Category;
  customItems?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  lang,
  product,
  category,
  customItems,
  className = "",
}) => {
  const pathname = usePathname();

  // Generate breadcrumb items based on the current path and context
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    // Always start with home
    items.push({
      label: lang === "ar" ? "الرئيسية" : "Accueil",
      href: `/${lang}`,
    });

    // If custom items are provided, use them
    if (customItems) {
      return [...items, ...customItems];
    }

    // Auto-generate based on pathname
    const pathSegments = pathname.split("/").filter(Boolean);

    // Remove locale from segments
    const segments = pathSegments.slice(1);

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;

      switch (segment) {
        case "products":
          if (!isLast) {
            items.push({
              label: lang === "ar" ? "المنتجات" : "Produits",
              href: `/${lang}/products`,
            });
          } else if (!product) {
            // If we're on products listing page
            items.push({
              label: lang === "ar" ? "المنتجات" : "Produits",
              href: `/${lang}/products`,
              isCurrentPage: true,
            });
          }
          break;

        case "categories":
          items.push({
            label: lang === "ar" ? "الفئات" : "Catégories",
            href: `/${lang}/categories`,
          });
          break;

        case "about":
          items.push({
            label: lang === "ar" ? "من نحن" : "À propos",
            href: `/${lang}/about`,
            isCurrentPage: isLast,
          });
          break;

        case "contact":
          items.push({
            label: lang === "ar" ? "اتصل بنا" : "Contact",
            href: `/${lang}/contact`,
            isCurrentPage: isLast,
          });
          break;

        default:
          // Handle dynamic segments like product slugs or category IDs
          if (index === segments.length - 1) {
            // This is likely a dynamic page
            if (product) {
              // Add category if available
              if (product.category) {
                items.push({
                  label: product.category.name[lang],
                  href: `/${lang}/categories/${product.category.id}`,
                });
              }
              // Add current product
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
    });

    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-8 ${className}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <ol className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                size={16}
                className={`mx-2 text-neutral-400 ${
                  lang === "ar" ? "rotate-180" : ""
                }`}
              />
            )}

            {item.isCurrentPage ? (
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors duration-200 hover:text-primary-700 dark:hover:text-primary-400 text-neutral-600 dark:text-neutral-400 flex items-center"
              >
                {index === 0 && (
                  <>
                    <span className="sr-only">{item.label}</span>
                    <Home
                      size={16}
                      className="text-primary-600 hover:text-primary-700"
                    />
                  </>
                )}
                {index > 0 && item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
