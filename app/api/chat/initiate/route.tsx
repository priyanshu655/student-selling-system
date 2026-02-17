import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Chat from "@/models/chat";
import Product from "@/models/Product";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ MUST await this because getAuthUser uses async cookies()
    const authUser: any = await getAuthUser();
    
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ message: "Login required ❌" }, { status: 401 });
    }

    const { productId } = await req.json();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found ❌" }, { status: 404 });
    }

    // Buyer = logged user, Seller = product owner
    const buyerId = authUser.userId;
    const sellerId = product.sellerId;

    // Prevent user from chatting with themselves
    if (buyerId.toString() === sellerId.toString()) {
      return NextResponse.json({ message: "You cannot chat with yourself ❌" }, { status: 400 });
    }

    // ✅ Check if chat already exists for this specific product + buyer pair
    let chat = await Chat.findOne({ productId, buyerId, sellerId });

    if (!chat) {
      chat = await Chat.create({
        productId,
        buyerId,
        sellerId,
        messages: [] // Ensure messages array is initialized
      });
    }

    // Return conversationId for the frontend to redirect
    return NextResponse.json({ conversationId: chat._id }, { status: 200 });

  } catch (error: any) {
    console.error("Chat Initiation Error:", error);
    return NextResponse.json(
      { message: "Server error ❌", error: error.message },
      { status: 500 }
    );
  }
}