// lib/auth.tsx
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getAuthUser() {
  // ✅ await the cookies() function
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}