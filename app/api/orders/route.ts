import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET() {
  await connectToDatabase();

  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { userId, items, address } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    let totalAmount = 0;

    const formattedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} out of stock` },
          { status: 400 }
        );
      }

      // deduct stock
      product.quantity -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      formattedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: userId,
      items: formattedItems,
      totalAmount,
      address,
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}