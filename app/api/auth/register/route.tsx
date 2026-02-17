import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    console.log("🔥 Register API Called");

    await connectDB();
    console.log("✅ MongoDB Connected");

    const { name, email, collegeId, password } = await req.json();

    console.log("📦 Data:", { name, email, collegeId });

    // Validation
    if (!name || !email || !collegeId || !password) {
      return NextResponse.json(
        { message: "All fields required ❌" },
        { status: 400 }
      );
    }

    // Check user exists
    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { message: "User already exists ❌" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      collegeId,
      password: hashedPassword,
    });

    console.log("✅ USER CREATED:", newUser);

    return NextResponse.json(
      { message: "Registered Successfully ✅" },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("❌ REGISTER ERROR:", error);

    return NextResponse.json(
      { message: "Server Error ❌", error: error.message },
      { status: 500 }
    );
  }
}
