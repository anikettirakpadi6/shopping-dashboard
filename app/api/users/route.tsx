import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { success } from "zod";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find(
      {},
      {
        name: 1,
        email: 1,
        role: 1,
        isActive: 1,
      },
    ).lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users!" },
      { status: 500 },
    );
  }
}
