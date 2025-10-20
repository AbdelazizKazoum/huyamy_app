import { Locale, Product } from "@/types";
import SectionTitle from "./SectionTitle";
import ProductCard from "./ProductCard";
import { ButtonSecondary } from "./ui";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/config"; // <-- Import Link

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showButton?: boolean;
  bgColor?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  showButton = false,
  bgColor = "bg-neutral-50",
}) => {
  const t = useTranslations("products");
  const currentLocale = useLocale() as Locale;
  const currency = siteConfig.currencies[currentLocale];

  return (
    <section
      className={`${bgColor} py-16 sm:py-24`}
      itemScope
      itemType="https://schema.org/CollectionPage"
      role="region"
      aria-labelledby="section-title"
    >
      {/* Hidden SEO metadata */}
      <meta itemProp="name" content={title} />
      {subtitle && <meta itemProp="description" content={subtitle} />}
      <meta itemProp="numberOfItems" content={products.length.toString()} />

      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title with improved SEO */}
        <header className="text-center mb-12">
          <div id="section-title">
            <SectionTitle>{title}</SectionTitle>
          </div>
          {subtitle && (
            <p
              className="text-center text-neutral-600 max-w-2xl mx-auto -mt-12 mb-12"
              itemProp="description"
            >
              {subtitle}
            </p>
          )}
        </header>

        {/* Products Grid with Schema.org ItemList */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          itemProp="mainEntity"
          itemScope
          itemType="https://schema.org/ItemList"
          role="list"
          aria-label={`${t("productsList")} - ${title}`}
        >
          <meta itemProp="numberOfItems" content={products.length.toString()} />

          {products.map((product, index) => (
            <div
              key={product.id}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              role="listitem"
            >
              <meta itemProp="position" content={(index + 1).toString()} />
              <div itemProp="item">
                <ProductCard
                  product={product}
                  lang={currentLocale}
                  currency={currency}
                />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button with enhanced SEO */}
        {showButton && (
          <footer className="text-center mt-16">
            <Link
              href="/products"
              locale={currentLocale}
              aria-label={`${t("viewAll")} ${title.toLowerCase()}`}
              role="button"
              className="inline-block"
            >
              <ButtonSecondary>{t("viewAll")}</ButtonSecondary>
            </Link>
          </footer>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
