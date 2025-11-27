// app/api/config/route.ts
import { NextResponse } from "next/server";
import { getCachedSiteConfig } from "@/lib/actions/config";

export async function GET() {
  try {
    // Use cached server action to avoid excessive DB calls
    const config = await getCachedSiteConfig();

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching site config:", error);
    return NextResponse.json(
      { error: "Failed to fetch site configuration" },
      { status: 500 }
    );
  }
}
