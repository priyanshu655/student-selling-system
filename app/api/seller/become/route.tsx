import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt"; // Using your helper for consistency

export async function POST(req: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized ❌" }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Invalid Session ❌" }, { status: 401 });
    }

    const { collegeId } = await req.json();
    if (!collegeId) {
      return NextResponse.json({ message: "College ID is required ❌" }, { status: 400 });
    }

    // Update user: ensure we don't create duplicate collegeIds if they change it
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { isSeller: true, collegeId },
      { new: true }
    );

    return NextResponse.json({
      message: "Seller Activated! 🚀",
      user: { isSeller: updatedUser.isSeller }
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ message: "College ID already in use ❌" }, { status: 400 });
    }
    return NextResponse.json({ message: "Activation failed ❌" }, { status: 500 });
  }
}