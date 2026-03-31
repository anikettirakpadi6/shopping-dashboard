import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await req.json();
    const updateData: any = {
      name: body.name,
      email: body.email,
      role: body.role,
      isActive: body.isActive,
    };


    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json({ user: updated });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found!" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete user!" },
      { status: 500 },
    );
  }
}