import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json([], { status: 401 });

    const decoded: any = verifyToken(token);

    // ✅ THE FIX: Ensure we query using the same ObjectId type
    const products = await Product.find({ 
      sellerId: new mongoose.Types.ObjectId(decoded.userId) 
    }).sort({ createdAt: -1 }); // Show newest first

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, max-age=0", // Stop Next.js from caching the empty list
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}