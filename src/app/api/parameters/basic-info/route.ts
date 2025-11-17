// app/api/parameters/basic-info/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, updateBasicInfo } from "@/lib/services/configService";

export async function GET() {
  try {
    const config = await getSiteConfig();

    // Return only basic info fields
    const basicInfo = {
      name: config?.name || "",
      brandName: config?.brandName || "",
      url: config?.url || "",
    };

    return NextResponse.json(basicInfo);
  } catch (error) {
    console.error("Error fetching basic info:", error);
    return NextResponse.json(
      { error: "Failed to fetch basic info" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, brandName, url } = body;

    if (!name || !brandName || !url) {
      return NextResponse.json(
        { error: "Name, brand name, and URL are required" },
        { status: 400 }
      );
    }

    // Update basic info
    await updateBasicInfo({
      name,
      brandName,
      url,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating basic info:", error);
    return NextResponse.json(
      { error: "Failed to update basic info" },
      { status: 500 }
    );
  }
}
