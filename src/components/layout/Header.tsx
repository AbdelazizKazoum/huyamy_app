"use client";

import { currencies } from "@/data";
import { Locale, LocalizedString } from "@/types";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/config";
import { useLocale } from "next-intl";
import CartSidebar from "../CartSidebar";
import { LanguageSelector } from "../ui";
import { useCartStore } from "@/store/useCartStore"; // 1. Import the cart store

type HeaderProps = Record<string, never>;

// Menu items configuration
interface MenuItem {
  href: string;
  label: LocalizedString;
}

const menuItems: MenuItem[] = [
  {
    href: "/",
    label: {
      ar: "الرئيسية",
      fr: "Accueil",
    },
  },
  {
    href: "/products",
    label: {
      ar: "المتجر",
      fr: "Produits",
    },
  },
  // {
  //   href: "/offers",
  //   label: {
  //     ar: "عروض",
  //     fr: "Offres",
  //   },
  // },
  {
    href: "/contact",
    label: {
      ar: "تواصل معنا",
      fr: "Contact",
    },
  },
];

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const [isMobileLangMenuOpen, setIsMobileLangMenuOpen] =
    useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLangLoading, setIsLangLoading] = useState(false);

  // 2. Get cart items from the global store
  const { items: cartItems } = useCartStore();

  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const currency = currencies[currentLocale];

  // Locale-aware text
  const searchText = {
    ar: "بحث",
    fr: "Rechercher",
  };

  const searchPlaceholder = {
    ar: "ابحث عن منتجك المفضل...",
    fr: "Recherchez votre produit préféré...",
  };

  // 3. Remove local state handlers for cart
  const handleLanguageChange = async (newLocale: Locale) => {
    setIsLangLoading(true);
    setIsLangMenuOpen(false);
    setIsMobileLangMenuOpen(false);
    await router.replace(pathname, { locale: newLocale });
    setIsLangLoading(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <>
      {/* 4. Update CartSidebar props */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lang={currentLocale}
        currency={currency}
      />
      <div className="sticky top-0 z-40">
        <header className="bg-white/90 backdrop-blur-lg shadow-sm">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/huyami_logo.jpeg"
                    alt="Huyamy Coopérative"
                    width={160}
                    height={80}
                    className="h-12 w-auto object-contain"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex md:items-center gap-8">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`transition-colors duration-300 ${
                        isActive
                          ? "text-primary-800 font-semibold border-b-2 border-primary-700 pb-1"
                          : "text-neutral-600 hover:text-primary-800"
                      }`}
                    >
                      {item.label[currentLocale]}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop buttons: hidden on mobile */}
              <div className="hidden md:flex items-center gap-2 rtl:gap-x-reverse">
                <LanguageSelector
                  lang={currentLocale}
                  onLanguageChange={handleLanguageChange}
                  isOpen={isLangMenuOpen}
                  onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
                />
                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  className="flex items-center px-3 py-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300"
                >
                  <Search
                    size={22}
                    className={currentLocale === "ar" ? "ml-2" : "mr-2"}
                  />
                  <span className="font-semibold text-sm">
                    {searchText[currentLocale]}
                  </span>
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center px-3 py-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300 relative"
                >
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile buttons: visible only on mobile */}
              <div className="flex md:hidden items-center gap-2 rtl:gap-x-reverse">
                {/* 5. Add Cart button for mobile */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300 relative"
                >
                  <ShoppingCart size={24} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                {/* Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-neutral-200">
              <div className="flex flex-col items-center p-4 space-y-4">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`transition-colors duration-300 py-1 ${
                        isActive
                          ? "text-primary-800 font-semibold"
                          : "text-neutral-600 hover:text-primary-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label[currentLocale]}
                    </Link>
                  );
                })}

                <div className="border-t border-neutral-200 w-full my-2"></div>

                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-start min-w-[120px] max-w-[180px] px-3 py-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300"
                >
                  <Search
                    size={22}
                    className={currentLocale === "ar" ? "ml-2" : "mr-2"}
                  />
                  <span className="font-semibold text-sm">
                    {searchText[currentLocale]}
                  </span>
                </button>

                <div className="flex justify-center">
                  <LanguageSelector
                    lang={currentLocale}
                    onLanguageChange={(newLocale) => {
                      handleLanguageChange(newLocale);
                      setIsMobileLangMenuOpen(false);
                    }}
                    isOpen={isMobileLangMenuOpen}
                    onToggle={() =>
                      setIsMobileLangMenuOpen(!isMobileLangMenuOpen)
                    }
                    isMobile={true}
                  />
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Search Form Modal */}
        {isSearchOpen && (
          <div ref={searchRef} className="absolute top-full left-0 w-full z-50">
            <div className="bg-white shadow-md border-t border-neutral-100 transition-all duration-300">
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
                    placeholder={searchPlaceholder[currentLocale]}
                    autoFocus
                    className="w-full h-12 text-lg bg-neutral-100 border-2 border-transparent rounded-full pl-14 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-700"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Search className="h-6 w-6 text-neutral-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-800 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
