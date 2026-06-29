import {
  Home,
  Users,
  BarChart3,
  ShoppingCart,
  Package,
  LogOut,
  CheckSquare,
  LucideIcon,
  TriangleAlert,
} from "lucide-react";

import { useState } from "react";
import { signOut } from "next-auth/react";

interface MenuItem {
  label: string;
  key: string;
  icon: LucideIcon;
}

type UserRole = "admin" | "customer";

interface SidebarProps {
  role: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

const MENU_CONFIG: Record<UserRole, MenuItem[]> = {
  admin: [
    { label: "Overview", icon: Home, key: "overview" },
    { label: "Users", icon: Users, key: "users" },
    { label: "Analytics", icon: BarChart3, key: "analytics" },
    { label: "Products", icon: Package, key: "products" },
    { label: "Orders", icon: ShoppingCart, key: "orders" },
  ],
  customer: [
    { label: "Shop Products", icon: Package, key: "products" },
    { label: "My Orders", icon: ShoppingCart, key: "orders" },
  ],
  // employee: [{ label: "My Tasks", icon: CheckSquare, key: "tasks" }],
};

export default function Sidebar({
  role,
  activeTab,
  setActiveTab,
  onLogout,
}: SidebarProps) {
  const normalizedRole = (role?.toLowerCase() || "customer") as UserRole;
  const menuItems = MENU_CONFIG[normalizedRole] || [];
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <aside
      className="
        fixed left-0 top-0
        flex flex-col
        w-64 h-screen
        px-5 py-8
        bg-white
        border-r
        dark:bg-slate-900
        dark:border-slate-800
        transition-colors
        duration-300
      "
    >
      {/* Brand Section */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-9 h-9 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center transition-colors">
          <ShoppingCart className="text-white dark:text-slate-900" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          ShopStack
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 dark:bg-white dark:text-slate-900 dark:shadow-none"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
            >
              <item.icon
                size={20}
                className={`${isActive ? "text-white dark:text-slate-900" : "group-hover:text-slate-900 dark:group-hover:text-white transition-colors"}`}
              />
              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl
          text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                <TriangleAlert className="text-red-600" size={28} />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white">
              Logout?
            </h2>

            <p className="mt-2 text-center text-slate-500">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700
          hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  signOut({
                    callbackUrl: "/login",
                  })
                }
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
