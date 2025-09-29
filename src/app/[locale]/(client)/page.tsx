"use client";
import React, { useState, Fragment } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  Globe,
  ChevronDown,
  Truck,
  Clock,
  HandCoins,
} from "lucide-react";
import { Transition } from "@headlessui/react";

// --- Type Imports ---
import type { Language, Category, Product, CartItem } from "../../../types";

// --- Data Imports ---
import {
  currencies,
  categories,
  products,
  initialCartItems,
} from "../../../data";
import NoticeBar from "@/components/layout/NoticeBar";
import Header from "@/components/layout/Header";

// --- Components ---

const HeroSection: React.FC = () => {
  const features = [
    {
      icon: <Truck size={40} className="text-green-800 mb-4" />,
      title: "شحن مجاني",
      description: "لجميع الطلبات في المغرب",
    },
    {
      icon: <Clock size={40} className="text-green-800 mb-4" />,
      title: "توصيل في الوقت المحدد",
      description: "خلال 24 إلى 48 ساعة",
    },
    {
      icon: <HandCoins size={40} className="text-green-800 mb-4" />,
      title: "الدفع عند الاستلام",
      description: "الدفع نقداً عند وصول طلبك",
    },
  ];

  return (
    <section className="relative">
      {/* Promotional Banner */}
      <div className="w-full bg-[#f7f6f2]">
        <a href="#" className="block">
          <img
            src="https://placehold.co/1600x450/f7f6f2/166534?text=منتجات+طبيعية+بجودة+عالية"
            alt="عرض ترويجي"
            className="w-full h-auto object-cover"
          />
        </a>
      </div>

      {/* Feature Cards */}
      <div className="bg-white">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-16 relative z-10">
          {/* Desktop View: Grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center border border-gray-100"
              >
                {feature.icon}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
          {/* Mobile View: Single compact card */}
          <div className="md:hidden bg-white p-4 rounded-lg shadow-lg border border-gray-100">
            <div className="flex justify-around items-start text-center">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center px-1 w-1/3"
                >
                  {React.cloneElement(feature.icon, {
                    size: 32,
                    className: "text-green-800 mb-2",
                  })}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">
                    {feature.title}
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

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  return (
    <div className="text-center mb-16">
      <h2
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 inline-block relative"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        {children}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-green-700 rounded-full"></span>
      </h2>
    </div>
  );
};

interface CategoriesSectionProps {
  categories: Category[];
  lang?: Language;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  lang = "ar",
}) => {
  return (
    <div className="bg-white pt-16 sm:pt-24 pb-16 sm:pb-24">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>تصفح حسب الفئة</SectionTitle>
        <p className="text-center text-gray-600 max-w-2xl mx-auto -mt-12 mb-12">
          اكتشفي مجموعاتنا المتنوعة التي تلبي كل احتياجات جمالك.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
          {categories.map((category) => (
            <a
              href={`/collections/${category.name.fr
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              key={category.id}
              className="group text-center transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
                <img
                  src={category.image}
                  alt={category.name[lang || "ar"]}
                  className="w-full h-full object-cover rounded-full border-2 border-gray-200 group-hover:border-green-700 transition-all duration-300 shadow-sm"
                />
                <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-md font-semibold text-gray-800 group-hover:text-green-800 transition-colors duration-300">
                {category.name[lang || "ar"]}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  lang?: Language;
  currency?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang = "ar",
  currency = "د.م.",
}) => {
  const originalPriceNum = product.originalPrice || 0;
  let discountPercentage = 0;

  if (originalPriceNum > 0 && product.price > 0) {
    discountPercentage = Math.round(
      ((originalPriceNum - product.price) / originalPriceNum) * 100
    );
  }

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200/60 overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name[lang || "ar"]}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {lang === "ar" ? "جديد" : "Nouveau"}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {lang === "ar"
              ? `خصم ${discountPercentage}%`
              : `-${discountPercentage}%`}
          </span>
        )}
      </div>
      <div className="p-4 text-center flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2 h-14 flex items-center justify-center">
          {product.name[lang || "ar"]}
        </h3>
        <div className="flex items-baseline justify-center space-x-2 rtl:space-x-reverse mb-4">
          <p className="text-xl font-bold text-green-900">
            {product.price.toFixed(2)} {currency}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              {product.originalPrice.toFixed(2)} {currency}
            </p>
          )}
        </div>
        <button className="w-full bg-green-800 text-white font-bold py-3 px-6 rounded-full text-md hover:bg-green-900 transition-all duration-300 mt-auto">
          {(lang || "ar") === "ar" ? "اشتر الآن" : "Acheter"}
        </button>
      </div>
    </div>
  );
};

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  lang?: Language;
  currency?: string;
  showButton?: boolean;
  bgColor?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  lang = "ar",
  currency = "د.م.",
  showButton = false,
  bgColor = "bg-stone-50",
}) => {
  return (
    <div className={`${bgColor} py-16 sm:py-24`}>
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>{title}</SectionTitle>
        {subtitle && (
          <p className="text-center text-gray-600 max-w-2xl mx-auto -mt-12 mb-12">
            {subtitle}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              currency={currency}
            />
          ))}
        </div>
        {showButton && (
          <div className="text-center mt-16">
            <button className="bg-green-800 text-white font-bold py-3 px-10 rounded-full hover:bg-green-900 transition-all duration-300 shadow-md">
              عرض كل المنتجات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NewsletterSection: React.FC = () => {
  return (
    <div className="bg-amber-50/70 py-16 sm:py-24">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          انضمي إلى قائمتنا البريدية
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          اشتركي الآن لتكوني أول من يعرف عن أحدث منتجاتنا، العروض الحصرية،
          ونصائح الجمال.
        </p>
        <form
          className="max-w-md mx-auto flex"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="أدخلي بريدك الإلكتروني"
            className="w-full px-5 py-3 text-lg rounded-r-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-700 border-2 border-transparent"
            required
          />
          <button
            type="submit"
            className="bg-green-800 text-white font-bold px-6 py-3 rounded-l-full hover:bg-green-900 transition-all duration-300 whitespace-nowrap"
          >
            اشتراك
          </button>
        </form>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          <div className="md:col-span-1">
            <a href="#" className="flex flex-col items-start leading-none">
              <span
                className="text-4xl font-bold text-amber-400"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                Huyamy
              </span>
              <span className="text-sm text-gray-300 font-semibold -mt-1 tracking-wider">
                Coopérative
              </span>
            </a>
            <p className="text-gray-400 mt-4">
              متجرك الأول لمنتجات التجميل الطبيعية والعناية بالبشرة. نؤمن بقوة
              الطبيعة لتعزيز جمالك.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">خدمة العملاء</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  عن المتجر
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الشحن والتسليم
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  تواصل معنا
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات هامة</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الأسئلة المتكررة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ثقة و ضمان
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  شروط الاستخدام
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  سياسة الخصوصية
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          <p className="mb-4">
            &copy; {new Date().getFullYear()} Huyamy. جميع الحقوق محفوظة.
          </p>
          <div className="flex justify-center space-x-6 rtl:space-x-reverse">
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-400 hover:text-white transition-transform hover:scale-110"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white transition-transform hover:scale-110"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---
// This would be your `app/page.jsx` in a Next.js 15 project.
export default function EcommerceLandingPage() {
  return (
    <>
      <style>
        {`
          /* Custom styles can go here if needed */
      `}
      </style>
      <div
        dir="rtl"
        className="bg-white"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <NoticeBar />
        <Header />
        <main>
          <HeroSection />
          <CategoriesSection categories={categories} />
          <ProductSection
            title="مجموعاتنا الأكثر طلبا"
            subtitle="استكشفي المنتجات التي حازت على أعلى تقييمات من عملائنا."
            products={products.slice(0, 4)}
            bgColor="bg-stone-50"
          />
          <ProductSection
            title="تشكيلة منتجاتنا المميزة"
            subtitle="تصفحي تشكيلتنا المختارة من المنتجات الطبيعية التي نالت ثقة عملائنا."
            products={products.slice(0, 10)}
            showButton={true}
            bgColor="bg-white"
          />
        </main>
        <NewsletterSection />
        <Footer />
      </div>
    </>
  );
}
