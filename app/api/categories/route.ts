import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);

export async function GET() {
  await connectToDatabase();

  const categories = await Category.find().lean();
  return NextResponse.json(categories);
}
