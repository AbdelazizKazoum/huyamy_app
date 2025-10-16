/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/services/authService";
import { signUpApiSchema } from "@/lib/schemas/authSchema";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using API schema (without confirmPassword)
    const validatedData = signUpApiSchema.parse(body);

    // Create user
    const user = await createUser({
      email: validatedData.email,
      password: validatedData.password,
      displayName: validatedData.displayName,
      phoneNumber: validatedData.phoneNumber,
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب بنجاح",
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
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
