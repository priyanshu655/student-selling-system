import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Message from "@/models/Message";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const authUser = getAuthUser();
  if (!authUser) {
    return NextResponse.json({ message: "Login required ❌" }, { status: 401 });
  }

  const { chatId, text } = await req.json();

  if (!text) {
    return NextResponse.json({ message: "Message cannot be empty ❌" }, { status: 400 });
  }

  const message = await Message.create({
    chatId,
    senderId: authUser.userId,
    text,
  });

  return NextResponse.json(message, { status: 200 });
}
