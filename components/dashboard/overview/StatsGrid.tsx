import { TrendingUp, ShoppingBag, Users, AlertCircle } from "lucide-react";
import StatCard from "../shared/StatCard";

type Props = {
  stats: {
    revenue: number;
    orders: number;
    users: number;
    lowStock: number;
  };
};

export default function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value={`₹${stats.revenue.toLocaleString()}`}
        icon={TrendingUp}
        trend={12}
      />

      <StatCard
        title="Total Orders"
        value={stats.orders}
        icon={ShoppingBag}
        trend={8}
      />

      <StatCard
        title="Total Users"
        value={stats.users}
        icon={Users}
        trend={5}
      />

      <StatCard
        title="Low Stock"
        value={stats.lowStock}
        icon={AlertCircle}
      />
    </div>
  );
}