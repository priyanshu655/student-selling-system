import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import User from "@/models/User";

export const dynamic = "force-dynamic"; // ✅ Prevents Next.js from caching old data

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch products and populate seller email to fix missing domains on the fly
    // We use .populate() to get the email from the User model
    const products = await Product.find()
      .populate("sellerId", "email") 
      .sort({ createdAt: -1 })
      .lean();

    // 2. Data Repair & Standardization Layer
    const sanitizedProducts = products.map((product: any) => {
      let domain = product.sellerDomain;

      // If domain is missing (old data), extract it from the populated seller email
      if (!domain && product.sellerId?.email) {
        domain = product.sellerId.email.split("@")[1];
      }

      return {
        ...product,
        sellerDomain: domain ? domain.toLowerCase() : "unknown",
      };
    });

    return NextResponse.json(sanitizedProducts, { 
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      }
    });
  } catch (error: any) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json(
      {
        message: "Failed to load products ❌",
        error: error.message,
      },
      { status: 500 }
    );
  }
}