import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";

import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() || "";
  const role = req.nextUrl.searchParams.get("role");
  const tab = req.nextUrl.searchParams.get("tab");
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    await connectToDatabase();

    const regex = new RegExp(`^${query}`, "i");

    if (!query) {
      return NextResponse.json({
        products: [],
        users: [],
        orders: [],
        categories: [],
      });
    }

    // --------------------
    // ADMIN
    // --------------------

    if (role === "admin") {
      const [products, users, categories, orders] = await Promise.all([
        Product.find({ name: regex }).populate("categoryId").limit(5),

        User.find({
          $or: [{ name: regex }, { email: regex }],
        }).limit(5),

        Category.find({
          name: regex,
        }).limit(5),

        Order.find({
          $or: [
            { address: regex },
            { status: regex },
            { paymentStatus: regex },
          ],
        })
          .populate("user")
          .limit(5),
      ]);

      return NextResponse.json({
        products,
        users,
        categories,
        orders,
      });
    }

    // --------------------
    // CUSTOMER - SHOP
    // --------------------

    if (role === "customer" && tab === "products") {
      const [products, categories] = await Promise.all([
        Product.find({
          name: regex,
        })
          .populate("categoryId")
          .limit(5),

        Category.find({
          name: regex,
        }).limit(5),
      ]);

      return NextResponse.json({
        products,
        categories,
        users: [],
        orders: [],
      });
    }

    // --------------------
    // CUSTOMER - ORDERS
    // --------------------

    if (role === "customer" && tab === "orders") {
      const orders = await Order.find({
        user: userId,
        $or: [
          { status: regex },
          { address: regex },
          { paymentStatus: regex },
          { "items.name": regex },
        ]
      })
        .populate("user")
        .limit(5);

      return NextResponse.json({
        products: [],
        users: [],
        categories: [],
        orders,
      });
    }

    return NextResponse.json({
      products: [],
      users: [],
      orders: [],
      categories: [],
    });
  } catch (err) {
    console.error("Search API:", err);

    return NextResponse.json(
      {
        error: "Search failed",
      },
      {
        status: 500,
      },
    );
  }
}
