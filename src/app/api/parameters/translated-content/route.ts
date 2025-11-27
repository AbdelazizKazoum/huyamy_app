// app/api/parameters/translated-content/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getSiteConfig,
  updateTranslatedContent,
} from "@/lib/services/configService";
import { revalidateConfigCache } from "@/lib/actions/config";

export async function GET() {
  try {
    const config = await getSiteConfig();

    // Return only translated content fields
    const translatedContent = {
      titleTemplate: config?.titleTemplate || "",
      title: config?.title || { ar: "", fr: "" },
      description: config?.description || { ar: "", fr: "" },
      niche: config?.niche || { ar: "", fr: "" },
      keywords: config?.keywords || { ar: [], fr: [] },
    };

    return NextResponse.json(translatedContent);
  } catch (error) {
    console.error("Error fetching translated content:", error);
    return NextResponse.json(
      { error: "Failed to fetch translated content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { titleTemplate, title, description, niche, keywords } = body;

    // Validate titleTemplate is required
    if (!titleTemplate) {
      return NextResponse.json(
        { error: "Title template is required" },
        { status: 400 }
      );
    }

    // Update translated content
    await updateTranslatedContent({
      titleTemplate,
      title,
      description,
      niche,
      keywords,
    });

    // Revalidate the config cache after update
    await revalidateConfigCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating translated content:", error);
    return NextResponse.json(
      { error: "Failed to update translated content" },
      { status: 500 }
    );
  }
}
