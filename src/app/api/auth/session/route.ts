import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/services/authService";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return NextResponse.json({
        success: false,
        authenticated: false,
      });
    }

    const user = await verifyToken(sessionCookie.value);

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      authenticated: false,
    });
  }
}

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

    // Verify token
    await verifyToken(idToken);

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: "تم إنشاء الجلسة بنجاح",
    });

    response.cookies.set("session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "فشل في إنشاء الجلسة",
      },
      { status: 500 }
    );
  }
}
