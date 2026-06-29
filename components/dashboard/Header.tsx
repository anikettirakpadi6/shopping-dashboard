"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Sun,
  Moon,
  Search,
  X,
  ChevronDown,
  Package,
  Users,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useGlobalSearch } from "@/app/hooks/useGlobalSearch";
import { useRouter } from "next/navigation";

type Props = {
  activeTab: string;
  onMenuClick?: () => void;
};

export default function Header({
  activeTab,
  onMenuClick
}: Props) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@example.com";
  const userImage =
    session?.user?.image ||
    `https://ui-avatars.com/api/?name=${userName}&background=0f172a&color=fff`;

  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAdmin = session?.user.role === "admin";

  const router = useRouter();

  const {
      search,
      setSearch,
      results,
      loading,
  } = useGlobalSearch(
      session?.user.role ?? "",
      activeTab,
      session?.user.id
  );

  // Sync theme with document class
  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  // Prevent hydration mismatch by returning a placeholder or empty div with same height
  if (!mounted)
    return (
      <div className="h-[73px] w-full bg-white dark:bg-slate-900 border-b dark:border-slate-800" />
    );

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="w-5 h-0.5 bg-slate-900 dark:bg-white mb-1" />
        <div className="w-5 h-0.5 bg-slate-900 dark:bg-white mb-1" />
        <div className="w-5 h-0.5 bg-slate-900 dark:bg-white" />
      </button>
      {/* Left: Search Bar */}
      <div className="relative w-full max-w-md group flex-1 sm:flex-none">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors"
        />
        <input
          type="text"
          placeholder="Search products, orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl 
          text-slate-900 dark:text-white placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slatfocus:border-transparent
          transition-all duration-200"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
            text-slate-400 hover:text-slate-700 dark:hover:text-white
            hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X size={16} />
          </button>
        )}
        {search.trim() && (
          <div className="absolute mt-2 w-full rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xl max-h-96 overflow-y-auto z-50">
            {loading && (
              <div className="p-4 text-sm text-slate-500">Searching...</div>
            )}

            {!loading && (
              <>
                {results.products.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">
                      Products
                    </div>

                    {results.products.map((p: any) => (
                      <button
                        key={p._id}
                        onClick={() =>
                          router.push(`/dashboard?tab=products&id=${p._id}`)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                      >
                        <Package size={16} />
                        {p.name}
                      </button>
                    ))}
                  </>
                )}
                {isAdmin && results.users.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">
                      Users
                    </div>

                    {results.users.map((u: any) => (
                      <button
                        key={u._id}
                        onClick={() =>
                          router.push(`/dashboard?tab=users&id=${u._id}`)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                      >
                        <Users size={16} />
                        {u.name}
                      </button>
                    ))}
                  </>
                )}
                {results.orders.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">
                      Orders
                    </div>

                    {results.orders.map((o: any) => (
                      <button
                        key={o._id}
                        onClick={() =>
                          router.push(`/dashboard?tab=orders&id=${o._id}`)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                      >
                        <ShoppingBag size={16} />#{o._id.slice(-6)}
                      </button>
                    ))}
                  </>
                )}
                {!loading &&
                  results.products.length === 0 &&
                  results.users.length === 0 &&
                  results.orders.length === 0 &&
                  results.categories.length === 0 && (
                    <div className="p-4 text-sm text-slate-500">
                      No results found.
                    </div>
                  )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        {/* <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </button> */}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun size={18} className="text-yellow-500 fill-yellow-500" />
          ) : (
            <Moon size={18} className="text-slate-900 fill-slate-900" />
          )}
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-700 mx-1" />

        {/* User Profile Dropdown */}
        <button className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {userName}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {userEmail.length > 20
                ? userEmail.substring(0, 17) + "..."
                : userEmail}
            </p>
          </div>

          <div className="relative">
            <img
              src={userImage}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <ChevronDown
            size={14}
            className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
          />
        </button>
      </div>
    </header>
  );
}
