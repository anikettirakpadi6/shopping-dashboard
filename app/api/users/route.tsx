import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

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

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    if (!body._id) {
      delete body._id;
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      name: body.name,
      email: body.email,
      role: body.role,
      isActive: Boolean(body.isActive),
      password: hashedPassword, 
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
