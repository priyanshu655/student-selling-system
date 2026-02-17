import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    
    // 1. Get Token & Verify User
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);
    const userId = decoded.userId;

    // 2. Get Product ID from body
    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ message: "Product ID required" }, { status: 400 });

    // 3. Delete ONLY if the seller matches the logged-in user
    const deletedProduct = await Product.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(productId),
      sellerId: new mongoose.Types.ObjectId(userId) // Security: Check ownership
    });

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully ✅" });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}