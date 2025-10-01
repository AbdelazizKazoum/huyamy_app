import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { heroFeatures, getFeatureIcon } from "@/data/heroFeatures";
import { Locale } from "@/types";

const HeroSection: React.FC = () => {
  const t = useTranslations("hero");
  const currentLocale = useLocale() as Locale;

  return (
    <section className="relative">
      {/* Promotional Banner */}
      <div
        className="w-full"
        style={{ backgroundColor: "var(--color-background-secondary)" }}
      >
        <a href="#" className="block">
          <Image
            src="https://placehold.co/1600x450/f7f6f2/166534?text=منتجات+طبيعية+بجودة+عالية"
            alt={t("promoAlt")}
            width={1600}
            height={450}
            className="w-full h-auto object-cover"
            priority
          />
        </a>
      </div>

      {/* Feature Cards */}
      <div className="bg-white">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-16 relative z-10">
          {/* Desktop View: Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {heroFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center border border-neutral-100"
              >
                {getFeatureIcon(feature.iconName, 40, "text-primary-800 mb-4")}
                <h3 className="text-xl font-bold text-neutral-800 mb-2">
                  {feature.title[currentLocale]}
                </h3>
                <p className="text-neutral-500">
                  {feature.description[currentLocale]}
                </p>
              </div>
            ))}
          </div>
          {/* Mobile View: Single compact card */}
          <div className="md:hidden bg-white p-4 rounded-lg shadow-lg border border-neutral-100">
            <div className="flex justify-around items-start text-center">
              {heroFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex flex-col items-center px-1 w-1/3"
                >
                  {getFeatureIcon(
                    feature.iconName,
                    32,
                    "text-primary-800 mb-2"
                  )}
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-800 leading-tight">
                    {feature.title[currentLocale]}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
