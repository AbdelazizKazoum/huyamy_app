import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale: string;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  currentLocale,
}) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={searchRef} className="absolute top-full left-0 w-full z-50">
      <div className="bg-white shadow-md border-t border-neutral-100 transition-all duration-300">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchValue.trim()) {
                router.push(
                  `/products?search=${encodeURIComponent(searchValue.trim())}`
                );
                onClose();
              }
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full h-12 text-lg bg-neutral-100 border-2 border-transparent rounded-full pl-14 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-700"
            />
            <button
              type="submit"
              disabled={!searchValue.trim()}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors duration-200
                ${
                  searchValue.trim()
                    ? "bg-primary-100 text-primary-700 cursor-pointer hover:bg-primary-200"
                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                }
              `}
              title={
                searchValue.trim() ? "Click to search" : "Type to enable search"
              }
              aria-label="Search"
            >
              <Search
                className={`h-6 w-6 transition-transform duration-200 ${
                  searchValue.trim() ? "scale-110" : "scale-100"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-800 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
