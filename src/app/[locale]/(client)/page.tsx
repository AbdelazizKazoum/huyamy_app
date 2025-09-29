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

// --- Components ---

const NoticeBar: React.FC = () => {
  return (
    <div className="bg-green-100 text-green-900 py-3 text-center">
      <span className="text-sm md:text-lg font-bold tracking-wide px-4">
        شحن مجاني لجميع الطلبات في المغرب خلال 24 إلى 48 ساعة – الدفع عند
        الاستلام متاح
      </span>
    </div>
  );
};

type HeaderProps = Record<string, never>;

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [lang, setLang] = useState<Language>("ar");

  const currency = currencies[lang];

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  };

  return (
    <>
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        lang={lang}
        currency={currency}
      />
      <div className="sticky top-0 z-40">
        <header className="bg-white/90 backdrop-blur-lg shadow-sm">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="#" className="flex flex-col items-start leading-none">
                  <span
                    className="text-4xl font-bold text-amber-500"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    Huyamy
                  </span>
                  <span className="text-sm text-green-800 font-semibold -mt-1 tracking-wider">
                    Coopérative
                  </span>
                </a>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex md:items-center md:space-x-8 md:rtl:space-x-reverse">
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors duration-300"
                >
                  الرئيسية
                </a>
                <a
                  href="#"
                  className="text-green-800 font-semibold border-b-2 border-green-700 pb-1"
                >
                  المتجر
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors duration-300"
                >
                  عروض
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors duration-300"
                >
                  تواصل معنا
                </a>
              </nav>

              {/* Icons */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-600 hover:text-green-800 rounded-full hover:bg-gray-100 transition-colors duration-300 hidden md:block"
                >
                  <Search size={24} />
                </button>

                {/* Language Selector */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center p-2 text-gray-600 hover:text-green-800 rounded-full hover:bg-gray-100 transition-colors duration-300"
                  >
                    <Globe size={24} />
                    <span className="font-semibold mx-1 text-sm">
                      {lang.toUpperCase()}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isLangMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isLangMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border z-50">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setLang("ar");
                          setIsLangMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        العربية (AR)
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setLang("fr");
                          setIsLangMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Français (FR)
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 text-gray-600 hover:text-green-800 rounded-full hover:bg-gray-100 transition-colors duration-300 relative"
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-gray-600 hover:text-green-800 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="flex flex-col items-center p-4 space-y-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors duration-300"
                >
                  الرئيسية
                </a>
                <a href="#" className="text-green-800 font-semibold">
                  المتجر
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors duration-300"
                >
                  عروض
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-800 transition-colors duration-300"
                >
                  تواصل معنا
                </a>

                <div className="border-t border-gray-200 w-full my-2"></div>

                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-green-800 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <Search size={22} />
                  <span className="mr-3">بحث</span>
                </button>

                <div className="w-full">
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="w-full flex items-center justify-between p-2 text-gray-600 hover:text-green-800 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="flex items-center">
                      <Globe size={22} />
                      <span className="mr-3">اللغة: {lang.toUpperCase()}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isLangMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isLangMenuOpen && (
                    <div className="pl-8 rtl:pr-8 rtl:pl-0 pt-2 space-y-2 text-right">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setLang("ar");
                          setIsLangMenuOpen(false);
                        }}
                        className="block text-gray-700 hover:text-green-800"
                      >
                        العربية (AR)
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setLang("fr");
                          setIsLangMenuOpen(false);
                        }}
                        className="block text-gray-700 hover:text-green-800"
                      >
                        Français (FR)
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        {isSearchOpen && (
          <div className="bg-white shadow-md border-t border-gray-100 transition-all duration-300">
            <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSearchOpen(false);
                }}
              >
                <input
                  type="text"
                  placeholder="...ابحث عن منتجك المفضل"
                  autoFocus
                  className="w-full h-12 text-lg bg-gray-100 border-2 border-transparent rounded-full pl-14 pr-12 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

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

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  lang: Language;
  currency: string;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  lang,
  currency,
}) => {
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50" dir="rtl">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
        </Transition.Child>

        {/* Cart Panel */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                سلة التسوق
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {items.length > 0 ? (
              <>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center space-x-4 rtl:space-x-reverse"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name[lang || "ar"]}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800">
                          {item.product.name[lang || "ar"]}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {item.product.price.toFixed(2)} {currency}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center border rounded-full">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-r-full"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 text-lg font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-l-full"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="mr-auto p-2 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-gray-600">
                      المجموع الفرعي
                    </span>
                    <span className="text-2xl font-bold text-gray-800">
                      {subtotal.toFixed(2)} {currency}
                    </span>
                  </div>
                  <button className="w-full bg-green-800 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-green-900 transition-all duration-300">
                    إتمام الشراء
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full text-center mt-3 text-green-800 font-semibold hover:underline"
                  >
                    أو متابعة التسوق
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <ShoppingCart size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  سلة التسوق فارغة
                </h3>
                <p className="text-gray-500 mt-2">
                  لم تقم بإضافة أي منتجات بعد.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-green-800 text-white font-bold py-3 px-8 rounded-full hover:bg-green-900 transition-all duration-300"
                >
                  ابدأ التسوق
                </button>
              </div>
            )}
          </div>
        </Transition.Child>
      </div>
    </Transition>
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
