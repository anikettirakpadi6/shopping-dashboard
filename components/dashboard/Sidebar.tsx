import {
  Home,
  Users,
  BarChart3,
  ShoppingCart,
  Package,
  LogOut,
  CheckSquare,
  LucideIcon,
} from "lucide-react";

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
    { label: "Shop Products", icon: Package, key: "shop" },
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

  return (
    <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r dark:bg-slate-900 dark:border-slate-800 transition-colors duration-300">
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
      {/* <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onLogout}
          className="group flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 font-semibold
            hover:bg-red-600 hover:text-white transition-all duration-200 active:scale-95"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Logout</span>
        </button>

         <div className="mt-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">User Name</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{normalizedRole}</p>
          </div>
        </div> 
      </div> */}
    </aside>
  );
}
