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

const LANGUAGES: { code: Locale; labelKey: string }[] = [
  { code: "ar", labelKey: "arabic" },
  { code: "fr", labelKey: "french" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  lang,
  onLanguageChange,
  isOpen,
  onToggle,
  isMobile = false,
}) => {
  const t = useTranslations("languageSelector");

  // Hook to handle clicks outside the component
  const dropdownRef = useClickOutside(() => {
    if (isOpen) {
      onToggle();
    }
  });

  const handleLanguageSelect = (selectedLang: Locale) => {
    onLanguageChange(selectedLang);
    onToggle(); // Close the dropdown
  };

  // Get selected language label
  const selectedLabel =
    LANGUAGES.find((l) => l.code === lang)?.labelKey ?? lang.toUpperCase();

  return (
    <div
      className={`relative ${isMobile ? "w-full" : ""}`}
      ref={dropdownRef}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full px-4 py-2 rounded-xl shadow-sm border border-neutral-200 bg-white hover:bg-neutral-50 transition-all duration-200 ${
          isMobile ? "text-base" : "text-sm font-semibold"
        }`}
        aria-label={t("selectLanguage")}
      >
        <div className="flex items-center gap-2">
          <Globe size={isMobile ? 22 : 24} />
          <span>{t(selectedLabel)}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={`absolute top-full ${
            isMobile ? "left-0 w-full" : "right-0 w-44"
          } mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 z-50 py-2`}
          role="listbox"
        >
          {LANGUAGES.map(({ code, labelKey }) => (
            <button
              key={code}
              onClick={() => handleLanguageSelect(code)}
              className={`block w-full text-left px-4 py-2 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-800 transition-colors duration-150 ${
                lang === code ? "bg-neutral-100 font-bold" : ""
              }`}
              role="option"
              aria-selected={lang === code}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
