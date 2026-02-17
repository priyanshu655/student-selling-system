import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import User from "@/models/User"; // ✅ Must import User to get the email
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // 1. Authenticate User
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized ❌" }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Invalid Session ❌" }, { status: 401 });
    }

    // 2. Fetch User to get their Domain
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found ❌" }, { status: 404 });
    }

    // Extract domain from email (e.g., "student@mit.edu" -> "mit.edu")
    const sellerDomain = user.email.split("@")[1];

    // 3. Prepare Product Data
    const body = await req.json();

    const newProduct = new Product({
      ...body,
      sellerId: new mongoose.Types.ObjectId(decoded.userId), 
      sellerDomain: sellerDomain, // ✅ SAVE THE DOMAIN AUTOMATICALLY
    });

    await newProduct.save();

    return NextResponse.json({ 
      message: "Product listed in the Vault! 🚀",
      productId: newProduct._id 
    }, { status: 201 });

  } catch (err) {
    console.error("Add Product Error:", err);
    return NextResponse.json({ message: "Failed to add product ❌" }, { status: 500 });
  }
}