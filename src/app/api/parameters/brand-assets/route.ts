// app/api/parameters/brand-assets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, updateBrandAssets } from "@/lib/services/configService";
import { uploadImageToR2 } from "@/lib/services/R2Service";

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
    const formData = await request.formData();

    const logoFile = formData.get("logo") as File | null;
    const bannerFile = formData.get("banner") as File | null;
    const faviconFile = formData.get("favicon") as File | null;

    // Also accept string URLs for existing assets
    const logoUrl = formData.get("logoUrl") as string | null;
    const bannerUrl = formData.get("bannerUrl") as string | null;
    const faviconUrl = formData.get("faviconUrl") as string | null;

    const updateData: {
      logo?: string;
      banner?: string;
      favicon?: string;
    } = {};

    // Handle file uploads
    if (logoFile && logoFile.size > 0) {
      updateData.logo = await uploadImageToR2(logoFile);
    } else if (logoUrl) {
      updateData.logo = logoUrl;
    }

    if (bannerFile && bannerFile.size > 0) {
      updateData.banner = await uploadImageToR2(bannerFile);
    } else if (bannerUrl) {
      updateData.banner = bannerUrl;
    }

    if (faviconFile && faviconFile.size > 0) {
      updateData.favicon = await uploadImageToR2(faviconFile);
    } else if (faviconUrl) {
      updateData.favicon = faviconUrl;
    }

    // Update brand assets (all fields are optional)
    await updateBrandAssets(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating brand assets:", error);
    return NextResponse.json(
      { error: "Failed to update brand assets" },
      { status: 500 }
    );
  }
}
