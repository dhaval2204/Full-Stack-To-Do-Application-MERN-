import { NextRequest } from "next/server";
import { verifyToken, JWTPayload } from "@/lib/jwt";

export function getAuthUser(request: NextRequest): JWTPayload | null {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.substring(7);
    return verifyToken(token);
  } catch {
    return null;
  }
}
