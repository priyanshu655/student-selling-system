import { NextRequest, NextResponse } from "next/server"; // Use NextRequest for better typing
import { connectDB } from "@/lib/mongoose";
import Message from "@/models/Message"; // Double check: is it 'Message' or 'message'?
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> } // 1. Wrap params in a Promise
) {
  try {
    await connectDB();

    // 2. Await the params to get the chatId
    const { chatId } = await params;

    const authUser = await getAuthUser(); // Usually auth checks are async
    if (!authUser) {
      return NextResponse.json({ message: "Login required ❌" }, { status: 401 });
    }

    // 3. Use the unwrapped chatId
    const messages = await Message.find({ chatId }).sort({
      createdAt: 1,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}