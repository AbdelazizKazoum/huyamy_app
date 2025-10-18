/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { signUpApiSchema } from "@/lib/schemas/authSchema";
import { ZodError } from "zod";
import { createUser } from "@/lib/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signUpApiSchema.parse(body);

    // 1. Create user in Firebase Admin (server-side)
    const user = await createUser(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب بنجاح",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Sign up error:", error);

    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        {
          success: false,
          error: "auth/email-already-in-use",
        },
        { status: 400 }
      );
    }

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
        error: "auth/generic",
      },
      { status: 500 }
    );
  }
}
