import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    await connectToDatabase();

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return NextResponse.json(
      { message: "Password has been successfully reset." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset Password Error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
