// app/api/parameters/store-settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getSiteConfig,
  updateStoreSettings,
} from "@/lib/services/configService";

export async function GET() {
  try {
    const config = await getSiteConfig();

    // Return only store settings fields
    const storeSettings = {
      category: config?.category || "",
      defaultLocale: config?.i18n?.defaultLocale || "ar",
      currencies: config?.currencies || { ar: "", fr: "" },
    };

    return NextResponse.json(storeSettings);
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch store settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { category, defaultLocale, currencies } = body;

    // Validate required fields
    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!defaultLocale || !["ar", "fr"].includes(defaultLocale)) {
      return NextResponse.json(
        { error: "Valid default locale is required (ar or fr)" },
        { status: 400 }
      );
    }

    if (!currencies || !currencies.ar || !currencies.fr) {
      return NextResponse.json(
        { error: "Both Arabic and French currencies are required" },
        { status: 400 }
      );
    }

    // Update store settings
    await updateStoreSettings({
      category,
      defaultLocale,
      currencies,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating store settings:", error);
    return NextResponse.json(
      { error: "Failed to update store settings" },
      { status: 500 }
    );
  }
}
