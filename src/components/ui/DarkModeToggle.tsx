"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type DarkModeToggleProps = {
  className?: string;
};

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = "" }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 text-neutral-600 hover:text-primary-800 rounded-full hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-primary-400 dark:hover:bg-neutral-700 transition-all duration-300 ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun
          size={24}
          className="transform rotate-0 transition-transform duration-300"
        />
      ) : (
        <Moon
          size={24}
          className="transform rotate-0 transition-transform duration-300"
        />
      )}
    </button>
  );
};

export default DarkModeToggle;
