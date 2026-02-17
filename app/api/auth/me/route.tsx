import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

// Force Next.js to fetch fresh data every time this API is called
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = (await cookieStore).get("token")?.value;

    // 1. Check if token exists
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // 2. Verify Token
    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.userId) {
       // Clear invalid token from browser
       (await cookieStore).delete("token");
       return NextResponse.json({ user: null }, { status: 401 });
    }

    // 3. Fetch User from Database (Fresh Fetch)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    // 4. Extract Domain Logic
    const emailDomain = user.email.split("@")[1];

    // 5. Return with CACHE-CONTROL HEADERS to fix the Dashboard lag
    return NextResponse.json(
      { 
        user: { 
          ...user.toObject(), 
          emailDomain 
        } 
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );

  } catch (err) {
    console.error("Critical Auth Error:", err);
    return NextResponse.json({ user: null, error: "Server Error" }, { status: 500 });
  }
}