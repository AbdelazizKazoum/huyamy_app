import { LogOut, MenuIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Header: React.FC<{
  onDesktopSidebarToggle: () => void;
  onMobileSidebarOpen: () => void;
}> = ({ onDesktopSidebarToggle, onMobileSidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 h-16 p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onDesktopSidebarToggle}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full hidden md:block"
        >
          <MenuIcon size={24} />
        </button>
        <button
          onClick={onMobileSidebarOpen}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full md:hidden"
        >
          <MenuIcon size={24} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2"
          >
            <Image
              src="https://placehold.co/40x40/d1e4d1/166534?text=A"
              alt="Admin"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          </button>
          {isUserMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 z-50">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>تسجيل الخروج</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
