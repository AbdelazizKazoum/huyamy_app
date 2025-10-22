"use client";

import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { heroFeatures, getFeatureIcon } from "@/data/heroFeatures";
import { Locale } from "@/types";

const HeroSection: React.FC = () => {
  const t = useTranslations("hero");
  const currentLocale = useLocale() as Locale;

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: ["easeOut"],
      },
    },
  };

  return (
    <section className="relative">
      {/* Promotional Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full"
        style={{ backgroundColor: "var(--color-background-secondary)" }}
      >
        <a href="#" className="block">
          <Image
            src="/images/banner4.jpg"
            alt={t("promoAlt")}
            width={1600}
            height={450}
            className="w-full h-auto object-cover"
            priority
          />
        </a>
      </motion.div>

      {/* Feature Cards */}
      <div className="bg-white">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-20 relative z-10">
          {/* Unified View for all screen sizes */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {heroFeatures.map((feature) => (
              <motion.div
                key={feature.id}
                //@ts-expect-error: framer-motion type mismatch for variants prop on this element
                variants={cardItemVariants}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-row md:flex-col items-center text-left md:text-center"
              >
                <div
                  className={`flex-shrink-0 ${
                    currentLocale === "ar"
                      ? "ml-5 md:ml-0 md:mb-4"
                      : "mr-5 md:mr-0 md:mb-4"
                  }`}
                >
                  {getFeatureIcon(feature.iconName, 40, "text-primary-800")}
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-bold text-neutral-800 mb-1">
                    {feature.title[currentLocale]}
                  </h3>
                  <p className="hidden md:block text-neutral-500">
                    {feature.description[currentLocale]}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
