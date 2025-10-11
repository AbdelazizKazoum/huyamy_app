"use client";
import React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Locale } from "@/types";
import useClickOutside from "@/hooks/useClickOutside";
import { useTranslations } from "next-intl";

interface LanguageSelectorProps {
  lang: Locale;
  onLanguageChange: (lang: Locale) => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  lang,
  onLanguageChange,
  isOpen,
  onToggle,
  isMobile = false,
}) => {
  const t = useTranslations("languageSelector");
  const dropdownRef = useClickOutside(() => {
    if (isOpen) onToggle();
  });

  const handleLanguageSelect = (selectedLang: Locale) => {
    if (selectedLang !== lang) onLanguageChange(selectedLang);
    onToggle();
  };

  // Unified button style
  const buttonClass =
    "flex items-center px-3 py-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300";

  // Dropdown style
  const dropdownClass =
    "absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-xl z-50 py-2";

  return (
    <div
      className={`relative ${isMobile ? "w-auto flex justify-center" : ""}`}
      ref={dropdownRef}
    >
      <button
        onClick={onToggle}
        className="flex items-center px-3 py-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300"
        aria-label="Change language"
      >
        <Globe size={22} className={lang === "ar" ? "ml-2" : "mr-2"} />
        <span className="font-semibold text-sm">
          {LANGUAGES.find((l) => l.code === lang)?.label || lang.toUpperCase()}
        </span>
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={
            isMobile
              ? "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[90vw] max-w-xs bg-white rounded-xl shadow-2xl z-50 py-4"
              : "absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-xl z-50 py-2"
          }
        >
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => handleLanguageSelect(code)}
              className={`block w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded ${
                lang === code
                  ? "bg-neutral-100 font-semibold text-primary-800"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
