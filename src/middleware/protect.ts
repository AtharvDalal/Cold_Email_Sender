import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function authMiddleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // Attach user ID to request
  (req as any).userId = (decoded as any).userId;
}
