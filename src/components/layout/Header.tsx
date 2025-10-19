"use client";

import { Locale, LocalizedString } from "@/types";
import {
  Menu,
  Search,
  ShoppingCart,
  X,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
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
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

type HeaderProps = Record<string, never>;

// Menu items configuration
interface MenuItem {
  href: string;
  label: LocalizedString;
}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const [isMobileLangMenuOpen, setIsMobileLangMenuOpen] =
    useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLangLoading, setIsLangLoading] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const mobileAuthMenuRef = useRef<HTMLDivElement>(null); // This ref is no longer used by the mobile header icon, but might be by renderAuthDropdown logic

  const { items: cartItems } = useCartStore();
  const { isAuthenticated, user, loading, signOut } = useAuth();
  const t = useTranslations("header");

  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const currency = siteConfig.currencies[currentLocale];

  // Update menuItems to use translation keys:
  const menuItems: MenuItem[] = [
    { href: "/", label: { ar: t("home"), fr: t("home") } },
    { href: "/products", label: { ar: t("products"), fr: t("products") } },
    { href: "/contact", label: { ar: t("contact"), fr: t("contact") } },
  ];

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        authMenuRef.current &&
        !authMenuRef.current.contains(event.target as Node) &&
        // Ensure mobileAuthMenuRef check is still valid if renderAuthDropdown is used by it
        (!mobileAuthMenuRef.current ||
          !mobileAuthMenuRef.current.contains(event.target as Node))
      ) {
        setIsAuthMenuOpen(false);
      }
    }
    if (isAuthMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAuthMenuOpen]);

  const searchButtonClasses =
    "flex items-center px-3 py-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300";
  const cartButtonClasses =
    "flex items-center px-3 py-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300 relative";
  const authButtonClasses =
    "p-2 text-neutral-600 hover:text-primary-800 rounded-full transition-colors duration-300";

  const renderAuthDropdown = () => (
    <div
      className={`absolute mt-2 w-56 bg-white border border-neutral-200/75 rounded-lg shadow-lg z-50 animate-fade-in-up overflow-hidden ${
        currentLocale === "ar" ? "left-0" : "right-0"
      }`}
    >
      {!isAuthenticated ? (
        <div className="p-2 flex flex-col gap-1">
          <button
            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-neutral-100 text-left text-neutral-700 font-medium transition-colors rounded-md"
            onClick={() => {
              router.push("/signin");
              setIsAuthMenuOpen(false);
            }}
          >
            <LogIn size={16} className="text-neutral-500" />
            <span>{t("signin")}</span>
          </button>
          <button
            className="flex items-center gap-3 w-full px-3 py-2 bg-primary-50 hover:bg-primary-100 text-left text-primary-700 font-medium transition-colors rounded-md"
            onClick={() => {
              router.push("/signup");
              setIsAuthMenuOpen(false);
            }}
          >
            <UserPlus size={16} />
            <span>{t("signup")}</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-200/75">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {user?.displayName || t("yourName")}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {user?.email || t("yourEmail")}
            </p>
          </div>
          <div className="p-2 flex flex-col gap-1">
            <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-neutral-100 text-left text-neutral-700 font-medium transition-colors rounded-md">
              <LayoutDashboard size={16} className="text-neutral-500" />
              <span>{t("profile")}</span>
            </button>
            <button
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-red-50 text-left text-red-600 font-medium transition-colors rounded-md"
              onClick={() => {
                signOut();
                setIsAuthMenuOpen(false);
              }}
            >
              <LogOut size={16} />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

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
                    src="/images/huyami_logo.jpeg"
                    alt="Huyamy Coopérative"
                    width={160}
                    height={80}
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
                  className={searchButtonClasses}
                >
                  <Search
                    size={22}
                    className={currentLocale === "ar" ? "ml-2" : "mr-2"}
                  />
                  <span className="font-semibold text-sm">{t("search")}</span>
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className={cartButtonClasses}
                >
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                <div className="relative" ref={authMenuRef}>
                  {loading ? (
                    <div style={{ width: 40, height: 40 }} />
                  ) : isAuthenticated ? (
                    <button
                      onClick={() => setIsAuthMenuOpen((v) => !v)}
                      className={authButtonClasses}
                      aria-label="Open user menu"
                    >
                      {user?.displayName ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-800 font-bold text-base w-10 h-10 select-none transition-colors duration-200 hover:bg-primary-200">
                          {user.displayName
                            .trim()
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      ) : (
                        <User size={22} />
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAuthMenuOpen((v) => !v)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary-700 text-white rounded-full hover:bg-primary-800 transition-colors duration-300 text-sm font-medium"
                    >
                      <User size={18} />
                      <span>{t("signin")}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isAuthMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                  {!loading && isAuthMenuOpen && renderAuthDropdown()}
                </div>
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

                {/* --- AUTH ICON REMOVED FROM HERE --- */}

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
                  <span className="font-medium text-sm">{t("categories")}</span>
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
                  <span className="font-medium text-sm">{t("search")}</span>
                </button>
              </div>

              {/* Language Selector (styled like image) */}
              <div>
                <h3
                  className="text-sm font-medium text-neutral-500 mb-2 px-1"
                  dir={currentLocale === "ar" ? "rtl" : "ltr"}
                >
                  {t("language")}
                </h3>
                <button
                  onClick={() => setIsMobileLangMenuOpen(!isMobileLangMenuOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-700"
                >
                  <span className="flex items-center gap-3">
                    <Globe size={20} className="text-neutral-500" />
                    <span className="font-medium">
                      {currentLocale === "ar" ? "العربية" : "Français"}
                    </span>
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

              {/* Account Section (styled like image) */}
              <div>
                <h3
                  className="text-sm font-medium text-neutral-500 mb-2 px-1"
                  dir={currentLocale === "ar" ? "rtl" : "ltr"}
                >
                  {t("account")}
                </h3>
                {/* Only render after loading is false */}
                {!loading &&
                  (isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col items-center mb-2">
                        <span className="font-semibold text-neutral-800">
                          {user?.displayName || t("yourName")}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {user?.email || t("yourEmail")}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          /* TODO: Profile page */
                        }}
                        className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-medium"
                      >
                        <User size={20} />
                        <span>{t("profile")}</span>
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-red-600 font-medium"
                      >
                        <LogOut size={20} />
                        <span>{t("logout")}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          router.push("/signin");
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-medium"
                      >
                        <LogIn size={20} />
                        <span>{t("signin")}</span>
                      </button>
                      <button
                        onClick={() => {
                          router.push("/signup");
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-700 border border-primary-700 rounded-lg text-white font-medium"
                      >
                        <UserPlus size={20} />
                        <span>{t("signup")}</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* --- END MODIFIED Mobile Menu --- */}
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
                    placeholder={
                      currentLocale === "ar"
                        ? "ابحث عن منتجك المفضل..."
                        : "Recherchez votre produit préféré..."
                    }
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
