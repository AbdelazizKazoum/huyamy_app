import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/services/authService";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        {
          success: false,
          error: "رمز المصادقة مطلوب",
        },
        { status: 400 }
      );
    }

    const user = await verifyToken(idToken);

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "رمز غير صالح",
      },
      { status: 401 }
    );
  }
}
