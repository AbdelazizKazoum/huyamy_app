// app/api/parameters/social-media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, updateSocialMedia } from "@/lib/services/configService";

export async function GET() {
  try {
    const config = await getSiteConfig();

    // Return only social media fields
    const socialMedia = {
      social: config?.social || { twitter: "" },
      socialLinks: config?.socialLinks || {
        facebook: "",
        instagram: "",
        twitter: "",
      },
    };

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Error fetching social media:", error);
    return NextResponse.json(
      { error: "Failed to fetch social media" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { social, socialLinks } = body;

    // Validate required fields
    if (!social || !social.twitter) {
      return NextResponse.json(
        { error: "Twitter handle is required" },
        { status: 400 }
      );
    }

    // Validate URLs if provided
    if (socialLinks) {
      const urlRegex = /^https?:\/\/.+/;

      if (socialLinks.facebook && !urlRegex.test(socialLinks.facebook)) {
        return NextResponse.json(
          { error: "Invalid Facebook URL format" },
          { status: 400 }
        );
      }

      if (socialLinks.instagram && !urlRegex.test(socialLinks.instagram)) {
        return NextResponse.json(
          { error: "Invalid Instagram URL format" },
          { status: 400 }
        );
      }

      if (socialLinks.twitter && !urlRegex.test(socialLinks.twitter)) {
        return NextResponse.json(
          { error: "Invalid Twitter URL format" },
          { status: 400 }
        );
      }
    }

    // Update social media
    await updateSocialMedia({
      social: {
        twitter: social.twitter,
      },
      socialLinks,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating social media:", error);
    return NextResponse.json(
      { error: "Failed to update social media" },
      { status: 500 }
    );
  }
}
