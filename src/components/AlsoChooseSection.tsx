import Image from "next/image";
import { Product, Section, Locale } from "@/types";
import { ButtonPrimary } from "./ui";
import { Link } from "@/i18n/config";
import { useRef } from "react";

// You can use Heroicons or any SVG for modern arrows
const ArrowLeftIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface AlsoChooseSectionProps {
  section: Section;
  lang: Locale;
}

export const AlsoChooseSection: React.FC<AlsoChooseSectionProps> = ({
  section,
  lang,
}) => {
  const { title, ctaProducts } = section.data;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Adjust based on card width
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full px-2 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-4 text-primary-900">
          {title?.[lang] || title?.fr || "اختر أيضًا"}
        </h2>
        <div className="relative">
          <button
            type="button"
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-neutral-300 rounded-full p-2 shadow hover:bg-primary-100 transition flex items-center justify-center"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-neutral-300 rounded-full p-2 shadow hover:bg-primary-100 transition flex items-center justify-center"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ArrowRightIcon />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-2 scroll-smooth select-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {ctaProducts?.map((product: Product) => {
              // Find color values for this product
              const colorOption = product.variantOptions?.find(
                (opt) => opt.name[lang] === "اللون" || opt.name.fr === "Couleur"
              );
              const colorValues = colorOption?.values || [];
              return (
                <div
                  key={product.id}
                  className="min-w-[220px] max-w-[220px] bg-white rounded-xl shadow-md border border-neutral-200 flex flex-col items-center p-3 scale-90 transition-all duration-300 hover:scale-95 relative"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full flex flex-col items-center"
                  >
                    <div className="relative w-full">
                      <Image
                        src={product.image}
                        alt={product.name[lang] || product.name.fr}
                        width={180}
                        height={100}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      {/* Color swatches overlayed near the bottom of the image */}
                      {colorValues.length > 0 && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex flex-row gap-1 z-10">
                          {colorValues.map((color: string) => (
                            <span
                              key={color}
                              className="w-4 h-4 rounded-full border border-neutral-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-neutral-800 text-center mb-1 line-clamp-2">
                      {product.name[lang] || product.name.fr}
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary-900 font-bold text-sm">
                        {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-neutral-400 line-through text-xs">
                            {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                    </div>
                    <ButtonPrimary className="w-full mt-2 text-xs py-1">
                      {lang === "ar" ? "أضف إلى السلة" : "Ajouter au panier"}
                    </ButtonPrimary>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
