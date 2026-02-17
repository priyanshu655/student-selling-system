import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Message from "@/models/message";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  await connectDB();

  const authUser = getAuthUser();
  if (!authUser) {
    return NextResponse.json({ message: "Login required ❌" }, { status: 401 });
  }

  const messages = await Message.find({ chatId: params.chatId }).sort({
    createdAt: 1,
  });

  return NextResponse.json(messages);
}
