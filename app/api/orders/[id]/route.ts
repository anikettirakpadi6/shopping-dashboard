import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Order from "@/models/Order";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const { status } = await req.json();

  const order = await Order.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );

  return NextResponse.json({ order });
}