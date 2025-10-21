"use client";

import { LogOut, MenuIcon, ChevronDown, Store } from "lucide-react"; // Add Store icon
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Header: React.FC<{
  onDesktopSidebarToggle: () => void;
  onMobileSidebarOpen: () => void;
}> = ({ onDesktopSidebarToggle, onMobileSidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsUserMenuOpen(false);

    try {
      // Sign out
      await signOut();

      // Show success message
      toast.success("تم تسجيل الخروج بنجاح");

      // Use router.replace instead of window.location
      router.replace("/ar/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("فشل في تسجيل الخروج");
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-sm ">
      {/* Left Section - Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onDesktopSidebarToggle}
          className="hidden md:flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <MenuIcon size={20} />
        </button>
        <button
          onClick={onMobileSidebarOpen}
          className="md:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Open sidebar"
        >
          <MenuIcon size={20} />
        </button>
      </div>

      {/* Right Section - User Menu */}
      <div className="flex items-center gap-3">
        {/* Go to Store Button */}
        <button
          onClick={() => router.push("/ar")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all duration-200 font-semibold shadow-md border border-primary-600 hover:scale-105 active:scale-95"
          aria-label="Go to Store"
        >
          <Store size={18} className="mb-0.5" /> {/* Modern store icon */}
          <span>زيارة المتجر</span>
        </button>
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
            aria-label="User menu"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {getUserInitials()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {/* Chevron Icon */}
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              // If you use Tailwind RTL plugin, use: ltr:right-0 rtl:left-0
            >
              {/* User Info Section */}
              <div className="px-4 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-base shadow-md">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.displayName || "مستخدم"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-200">
                    <LogOut size={16} className="text-red-600" />
                  </div>
                  <span className="text-sm font-medium">
                    {isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
