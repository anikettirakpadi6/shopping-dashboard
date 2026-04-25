import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";

import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all data
    const [users, products, orders] = await Promise.all([
      User.find(),
      Product.find(),
      Order.find(),
    ]);

    // ===== USERS =====
    const usersStats = {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
    };

    // ===== PRODUCTS =====
    const productsStats = {
      total: products.length,
      lowStock: products.filter(
        (p) => p.quantity > 0 && p.quantity < 5
      ).length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
    };

    // ===== ORDERS =====
    const ordersStats = {
      total: orders.length,
      revenue: orders.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
      ),
      pending: orders.filter((o) => o.status === "pending").length,
      completed: orders.filter((o) => o.status === "completed").length,
    };

    // ===== CHART (last 7 days mock based on orders) =====
    const last7Days: any[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayLabel = date.toLocaleDateString("en-IN", {
        weekday: "short",
      });

      const dayOrders = orders.filter((o) => {
        const created = new Date(o.createdAt);
        return created.toDateString() === date.toDateString();
      });

      last7Days.push({
        day: dayLabel,
        orders: dayOrders.length,
        revenue: dayOrders.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0
        ),
      });
    }

    return NextResponse.json({
      stats: {
        users: usersStats,
        products: productsStats,
        orders: ordersStats,
      },
      chart: last7Days,
    });
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}