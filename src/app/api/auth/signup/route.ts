/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { signUpApiSchema } from "@/lib/schemas/authSchema";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using API schema (without confirmPassword)
    const validatedData = signUpApiSchema.parse(body);

    // 1. Verify the ID token from the client
    const { idToken, displayName, address, city, phone } = validatedData;
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "رمز المصادقة مفقود" },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(idToken);

    // 2. Save extra info in Firestore
    const userProfile = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      displayName: displayName ?? null,
      phone: phone ?? null,
      address: address ?? null,
      city: city ?? null,
      isAdmin: false,
      emailVerified: decoded.email_verified ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("users").doc(decoded.uid).set(userProfile);

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب بنجاح",
        user: userProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign up error:", error);

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

    if ((error as any).code === "auth/email-already-exists") {
      return NextResponse.json(
        {
          success: false,
          error: "البريد الإلكتروني مستخدم بالفعل",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "فشل في إنشاء الحساب",
      },
      { status: 500 }
    );
  }
}
