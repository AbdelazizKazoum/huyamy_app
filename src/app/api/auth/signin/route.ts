import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/services/authService";
import { signInSchema } from "@/lib/schemas/authSchema";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = signInSchema.parse(body);

    // Note: Firebase Auth sign-in happens on the client side
    // This endpoint is for verifying tokens
    const { idToken } = body;

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
      message: "تم تسجيل الدخول بنجاح",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Sign in error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "بيانات غير صالحة",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "فشل في تسجيل الدخول",
      },
      { status: 401 }
    );
  }
}
