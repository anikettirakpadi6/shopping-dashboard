import { Home, Users, BarChart3, ShoppingCart } from "lucide-react";

type MenuItem = {
  label: string;
  key: string;
};

const menuConfig: Record<string, Array<{ label: string; icon: any }>> = {
  admin: [
    { label: "Overview", icon: Home },
    { label: "Users", icon: Users },
    { label: "Analytics", icon: BarChart3 },
  ],
  customer: [{ label: "My Orders", icon: ShoppingCart }],
  employee: [{ label: "Tasks", icon: Home }],
};

export default function Sidebar({ role }: { role: string }) {
  const normalizedRole = role?.toLowerCase();
  const menu = menuConfig[normalizedRole] || [];

  return (
    <div className="h-screen w-64 bg-white text-gray-900 p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 capitalize">
        {normalizedRole} Panel
      </h1>

      <ul className="space-y-2">
        {menu.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 cursor-pointer transition"
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
