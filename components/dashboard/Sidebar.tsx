import { Home, Users, BarChart3, ShoppingCart, Package } from "lucide-react";

type MenuItem = {
  label: string;
  key: string;
  icon: any;
};

type Props = {
  role: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const menuConfig: Record<string, MenuItem[]> = {
  admin: [
    { label: "Overview", icon: Home, key: "overview" },
    { label: "Users", icon: Users, key: "users" },
    { label: "Analytics", icon: BarChart3, key: "analytics" },
    { label: "Products", icon: Package, key: "products" },
  ],
  customer: [{ label: "My Orders", icon: ShoppingCart, key: "orders" }],
  employee: [{ label: "Tasks", icon: Home, key: "tasks" }],
};

export default function Sidebar({ role, activeTab, setActiveTab }: Props) {
  const normalizedRole = role?.toLowerCase();
  const menu = menuConfig[normalizedRole] || [];

  return (
    <div className="h-screen w-64 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-5 flex flex-col transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-8 capitalize text-black dark:text-white">
        {normalizedRole} Panel
      </h1>

      <ul className="space-y-2">
        {menu.map((item) => {
          const isActive = activeTab === item.key;

          return (
            <li
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-300
                ${isActive ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-gray-200 dark:hover:bg-slate-700"}`}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
