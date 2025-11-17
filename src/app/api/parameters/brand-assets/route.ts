// app/api/parameters/brand-assets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, updateBrandAssets } from "@/lib/services/configService";

export async function GET() {
  try {
    const config = await getSiteConfig();

    // Return only brand assets fields
    const brandAssets = {
      logo: config?.logo || "",
      banner: config?.banner || "",
      favicon: config?.favicon || "",
    };

    return NextResponse.json(brandAssets);
  } catch (error) {
    console.error("Error fetching brand assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand assets" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { logo, banner, favicon } = body;

    // Update brand assets (all fields are optional)
    await updateBrandAssets({
      logo,
      banner,
      favicon,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating brand assets:", error);
    return NextResponse.json(
      { error: "Failed to update brand assets" },
      { status: 500 }
    );
  }
}
