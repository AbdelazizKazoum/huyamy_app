// app/api/config/init/route.ts
import { NextResponse } from "next/server";
import { initializeSiteConfig } from "@/lib/services/configService";

export async function POST() {
  try {
    await initializeSiteConfig();

    return NextResponse.json({
      success: true,
      message: "Site config initialized successfully"
    });
  } catch (error) {
    console.error("Error initializing config:", error);
    return NextResponse.json(
      { error: "Failed to initialize site configuration" },
      { status: 500 }
    );
  }
}