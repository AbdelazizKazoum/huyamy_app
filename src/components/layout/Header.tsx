"use client";

import { currencies, initialCartItems } from "@/data";
import { CartItem, Language } from "@/types";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartSidebar from "../CartSidebar";
import { LanguageSelector } from "../ui";

type HeaderProps = Record<string, never>;

// Menu items configuration
interface MenuItem {
  label: string;
  href: string;
  arLabel: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Home",
    href: "/",
    arLabel: "الرئيسية",
  },
  {
    label: "Products",
    href: "/products",
    arLabel: "المتجر",
  },
  {
    label: "Offers",
    href: "/offers",
    arLabel: "عروض",
  },
  {
    label: "Contact",
    href: "/contact",
    arLabel: "تواصل معنا",
  },
];

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [lang, setLang] = useState<Language>("ar");
  const pathname = usePathname();

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

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setIsLangMenuOpen(false);
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
              <nav className="hidden md:flex md:items-center md:space-x-8 md:rtl:space-x-reverse">
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
                      {item.arLabel}
                    </Link>
                  );
                })}
              </nav>

              {/* Icons */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300 hidden md:block"
                >
                  <Search size={24} />
                </button>

                {/* Language Selector */}
                <div className="hidden md:block">
                  <LanguageSelector
                    lang={lang}
                    onLanguageChange={handleLanguageChange}
                    isOpen={isLangMenuOpen}
                    onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  />
                </div>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300 relative"
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-1 -right-1 bg-primary-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors"
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
                      className={`transition-colors duration-300 ${
                        isActive
                          ? "text-primary-800 font-semibold"
                          : "text-neutral-600 hover:text-primary-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.arLabel}
                    </Link>
                  );
                })}

                <div className="border-t border-neutral-200 w-full my-2"></div>

                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center p-2 text-neutral-600 hover:text-primary-800 rounded-lg hover:bg-neutral-100 transition-colors duration-300"
                >
                  <Search size={22} />
                  <span className="mr-3">بحث</span>
                </button>

                <LanguageSelector
                  lang={lang}
                  onLanguageChange={handleLanguageChange}
                  isOpen={isLangMenuOpen}
                  onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  isMobile={true}
                />
              </div>
            </div>
          )}
        </header>

        {isSearchOpen && (
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
                  placeholder="...ابحث عن منتجك المفضل"
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
        )}
      </div>
    </>
  );
};

export default Header;
