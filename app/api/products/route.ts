import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  await connectToDatabase();
  const products = await Product.find().lean();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    //  Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 },
      );
    }

    //  Clean & transform data
    const productData = {
      name: body.name,
      description: body.description || "",
      image: body.image || "",
      price: Number(body.price),
      quantity: Number(body.quantity) || 0,
      categoryId:
        body.categoryId && mongoose.Types.ObjectId.isValid(body.categoryId)
          ? body.categoryId
          : null,
    };

    const product = await Product.create(productData);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("POST /api/products error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
