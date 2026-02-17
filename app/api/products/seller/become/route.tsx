import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Not logged in ❌" },
        { status: 401 }
      );
    }

    const { collegeId } = await req.json();

    await User.findByIdAndUpdate(authUser.userId, {
      isSeller: true,
      collegeId,
    });

    return NextResponse.json({
      message: "Seller activated ✅",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error ❌" },
      { status: 500 }
    );
  }
}
