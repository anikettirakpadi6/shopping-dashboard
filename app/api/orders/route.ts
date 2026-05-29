import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();

    const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

    return NextResponse.json({
      orders,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { userId, items, address, paymentStatus, payment } = body;

    // validate cart
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User required" }, { status: 400 });
    }

    let totalAmount = 0;

    const formattedItems = [];

    // validate + update stock
    for (const item of items) {
      const product = await Product.findById(item.productId || item._id);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      // stock check
      if (product.quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `${product.name} is out of stock`,
          },
          { status: 400 },
        );
      }

      // deduct stock
      product.quantity -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      formattedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // create order
    const order = await Order.create({
      user: userId,
      items: formattedItems,
      totalAmount,
      address: address || "Demo Address",
      status: paymentStatus === "paid" ? "processing" : "pending",
      paymentStatus: paymentStatus || "pending",
      payment: {
        method: payment?.method || "mock",
        transactionId: payment?.transactionId || null,
        paidAt: payment?.paidAt || null,
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    console.error("ORDER CREATE ERROR:", err);

    return NextResponse.json(
      {
        error: err.message || "Server error",
      },
      { status: 500 },
    );
  }
}
