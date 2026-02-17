import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1️⃣ Get Email + Password
    const { email, password } = await req.json();

    // 2️⃣ Find User
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found ❌" },
        { status: 404 }
      );
    }

    // 3️⃣ Compare Password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { message: "Wrong password ❌" },
        { status: 401 }
      );
    }

    // 4️⃣ Create JWT Token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // ✅ 5️⃣ Create Response Object FIRST
    const response = NextResponse.json(
      {
        message: "Login Success ✅",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          collegeId: user.collegeId,
          isSeller: user.isSeller,
        },
      },
      { status: 200 }
    );

    // ✅ 6️⃣ Set Cookie INSIDE Response
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Login Error:", err);

    return NextResponse.json(
      { message: "Server error ❌" },
      { status: 500 }
    );
  }
}
