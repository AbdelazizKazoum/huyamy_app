"use client";

import { Locale, LocalizedString } from "@/types";
import {
  Menu,
  Search,
  ShoppingCart,
  X,
  ChevronDown,
  LayoutGrid, // --- ADDED: For Categories icon ---
  Globe, // --- ADDED: For Language icon ---
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/config";
import { useLocale } from "next-intl";
import CartSidebar from "../CartSidebar";
import { LanguageSelector } from "../ui";
import { useCartStore } from "@/store/useCartStore";
import { siteConfig } from "@/config/site";
import SearchModal from "@/components/SearchModal";

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

  const { items: cartItems } = useCartStore();

  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const currency = siteConfig.currencies[currentLocale];

  const searchText = {
    ar: "بحث",
    fr: "Rechercher",
  };

  const categoriesText = { ar: "الفئات", fr: "Catégories" };
  const languageText = { ar: "اللغة", fr: "Langue" };
  const currentLangName = { ar: "العربية", fr: "Français" }[currentLocale];

  const searchPlaceholder = {
    ar: "ابحث عن منتجك المفضل...",
    fr: "Recherchez votre produit préféré...",
  };

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

  // Get logo path from siteConfig
  const logoPath = siteConfig.logo || "/images/huyami_logo.jpeg";

  return (
    <>
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lang={currentLocale}
        currency={currency}
      />
      <div className="sticky top-0 z-40">
        <header className="bg-white/90 backdrop-blur-lg border-b border-neutral-200/75">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image
                    src={logoPath}
                    alt="Huyamy Coopérative"
                    width={240}
                    height={120}
                    className="h-10 w-auto object-contain"
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

              {/* Desktop buttons */}
              <div className="hidden md:flex items-center gap-2 rtl:gap-x-reverse">
                <LanguageSelector
                  lang={currentLocale}
                  onLanguageChange={handleLanguageChange}
                  isOpen={isLangMenuOpen}
                  onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
                />
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

              {/* Mobile buttons */}
              <div className="flex md:hidden items-center gap-2 rtl:gap-x-reverse">
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
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* --- Mobile Menu (Animated) --- */}
          <div
            className={`
              md:hidden bg-white border-t border-neutral-200
              transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden
              ${isMenuOpen ? "opacity-100" : "opacity-0"}
            `}
            style={{ maxHeight: isMenuOpen ? "100vh" : "0px" }}
          >
            <div className="p-4 space-y-6">
              {/* Original Nav Links (Moved to top) */}
              <div className="border-b border-neutral-200 w-full pb-6 flex flex-col items-center gap-4">
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
              </div>

              {/* Categories & Search Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Categories Button (from image) */}
                <button
                  onClick={() => {
                    router.push("/products"); // Link to products page
                    setIsMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-neutral-100 rounded-lg text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <LayoutGrid size={24} />
                  <span className="font-medium text-sm">
                    {categoriesText[currentLocale]}
                  </span>
                </button>

                {/* Search Button (styled like image) */}
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-neutral-100 rounded-lg text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <Search size={24} />
                  <span className="font-medium text-sm">
                    {searchText[currentLocale]}
                  </span>
                </button>
              </div>

              {/* Language Selector (styled like image) */}
              <div>
                <h3
                  className="text-sm font-medium text-neutral-500 mb-2 px-1"
                  dir={currentLocale === "ar" ? "rtl" : "ltr"}
                >
                  {languageText[currentLocale]}
                </h3>
                <button
                  onClick={() => setIsMobileLangMenuOpen(!isMobileLangMenuOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-700"
                >
                  <span className="flex items-center gap-3">
                    <Globe size={20} className="text-neutral-500" />
                    <span className="font-medium">{currentLangName}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-neutral-500 transition-transform duration-200 ${
                      isMobileLangMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileLangMenuOpen && (
                  <div className="mt-2 p-2 bg-white border border-neutral-200 rounded-lg flex flex-col gap-1">
                    <button
                      onClick={() => handleLanguageChange("ar")}
                      disabled={isLangLoading}
                      className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                        currentLocale === "ar"
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-600 hover:bg-neutral-100"
                      } disabled:opacity-50`}
                    >
                      العربية
                    </button>
                    <button
                      onClick={() => handleLanguageChange("fr")}
                      disabled={isLangLoading}
                      className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                        currentLocale === "fr"
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-600 hover:bg-neutral-100"
                      } disabled:opacity-50`}
                    >
                      Français
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* --- END MODIFIED Mobile Menu --- */}
        </header>

        {/* Search Form Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          currentLocale={currentLocale}
        />
      </div>
    </>
  );
};

export default Header;
