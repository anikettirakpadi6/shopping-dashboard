import { useEffect, useState } from "react";

type OverviewData = {
  stats: {
    revenue: number;
    orders: number;
    users: number;
    lowStock: number;
  };
  chart: {
    day: string;
    sales: number;
  }[];
  activity: {
    type: string;
    text: string;
    val: string;
    time: string;
  }[];
};

export function useOverviewData() {
  const [data, setData] = useState<OverviewData>({
    stats: {
      revenue: 0,
      orders: 0,
      users: 0,
      lowStock: 0,
    },
    chart: [],
    activity: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      const [oRes, uRes, pRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/users"),
        fetch("/api/products"),
      ]);

      const { orders = [] } = await oRes.json();
      const { users = [] } = await uRes.json();
      const { products = [] } = await pRes.json();

      const revenue = orders.reduce(
        (sum: number, o: any) => sum + (o.totalAmount || 0),
        0
      );

      const lowStock = products.filter(
        (p: any) => (p.quantity || 0) < 5
      ).length;

      const grouped: Record<string, number> = orders.reduce(
        (acc: Record<string, number>, o: any) => {
          const day = new Date(o.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });

          acc[day] = (acc[day] || 0) + (o.totalAmount || 0);

          return acc;
        },
        {}
      );

      const chart = Object.entries(grouped)
        .map(([day, sales]) => ({
          day,
          sales,
        }))
        .slice(-7);

      const activity = [
        ...orders.slice(0, 3).map((o: any) => ({
          type: "order",
          text: `Order #...${o._id?.slice(-4)}`,
          val: `₹${o.totalAmount}`,
          time: o.createdAt,
        })),
        ...users.slice(0, 2).map((u: any) => ({
          type: "user",
          text: `New user: ${u.name}`,
          val: "Joined",
          time: u.createdAt || new Date().toISOString(),
        })),
      ].sort(
        (a, b) =>
          new Date(b.time).getTime() -
          new Date(a.time).getTime()
      );

      setData({
        stats: {
          revenue,
          orders: orders.length,
          users: users.length,
          lowStock,
        },
        chart,
        activity,
      });
    } catch (err) {
      console.error("Overview error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    data,
    loading,
    refresh: fetchOverview,
  };
}