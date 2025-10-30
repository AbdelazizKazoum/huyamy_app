import Image from "next/image";
import { Product, Section, Locale } from "@/types";
import { ButtonPrimary } from "./ui";
import { Link } from "@/i18n/config";
import { useRef } from "react";
import AlsoChooseProductCard from "./AlsoChooseProductCard";

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
    <section className="w-full px-2">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-4 text-primary-900">
          {title?.[lang] || title?.fr || ""}
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
            {ctaProducts?.map((product: Product) => (
              <AlsoChooseProductCard
                key={product.id}
                product={product}
                lang={lang}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
