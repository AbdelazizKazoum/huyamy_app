"use client";

import { currencies, initialCartItems } from "@/data";
import { CartItem, Language } from "@/types";
import {
  ChevronDown,
  Globe,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";
import CartSidebar from "../CartSidebar";

type HeaderProps = Record<string, never>;

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
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
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
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

export default Header;
