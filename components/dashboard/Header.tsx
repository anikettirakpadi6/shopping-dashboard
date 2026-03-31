"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const shouldDark = stored === "dark" || (stored === null && prefersDark);

    if (shouldDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");

    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  if (!mounted) return null;
  return (
    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
      {/* Search */}
      <input
        type="text"
        placeholder="Search"
        className="border text-gray-900 dark:text-white bg-white dark:bg-slate-700 rounded-lg px-4 py-2 w-1/3 transition-colors duration-300"
      />

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-black/20 dark:border-white/20"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Welcome */}
        <span className="text-sm font-medium text-black dark:text-white">
          Welcome back, {userName}
        </span>

        {/* Profile Image */}
        <img
          src="https://ui-avatars.com/api/?name=User&background=000&color=fff"
          alt="profile"
          className="w-9 h-9 rounded-full object-cover"
        />
      </div>
    </div>
  );
}
