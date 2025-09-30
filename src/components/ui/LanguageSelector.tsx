"use client";
import React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Language } from "@/types";
import useClickOutside from "@/hooks/useClickOutside";

interface LanguageSelectorProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  lang,
  onLanguageChange,
  isOpen,
  onToggle,
  isMobile = false,
}) => {
  // Hook to handle clicks outside the component
  const dropdownRef = useClickOutside(() => {
    if (isOpen) {
      onToggle();
    }
  });

  const handleLanguageSelect = (selectedLang: Language) => {
    onLanguageChange(selectedLang);
    onToggle(); // Close the dropdown
  };

  if (isMobile) {
    return (
      <div className="w-full" ref={dropdownRef}>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-2 text-neutral-600 hover:text-primary-800 rounded-lg hover:bg-neutral-100 transition-colors duration-300"
        >
          <div className="flex items-center">
            <Globe size={22} />
            <span className="mr-3">اللغة: {lang.toUpperCase()}</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="pl-8 rtl:pr-8 rtl:pl-0 pt-2 space-y-2 text-right">
            <button
              onClick={() => handleLanguageSelect("ar")}
              className="block text-neutral-700 hover:text-primary-800 w-full text-right"
            >
              العربية (AR)
            </button>
            <button
              onClick={() => handleLanguageSelect("fr")}
              className="block text-neutral-700 hover:text-primary-800 w-full text-right"
            >
              Français (FR)
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center p-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 transition-colors duration-300"
      >
        <Globe size={24} />
        <span className="font-semibold mx-1 text-sm">{lang.toUpperCase()}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-neutral-200 z-50">
          <button
            onClick={() => handleLanguageSelect("ar")}
            className="block w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            العربية (AR)
          </button>
          <button
            onClick={() => handleLanguageSelect("fr")}
            className="block w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            Français (FR)
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
