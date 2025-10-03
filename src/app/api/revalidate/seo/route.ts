import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { MASTER_CACHE_TAGS } from "@/lib/cache/tags";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Security check
    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Revalidate SEO-specific cache
    revalidateTag(MASTER_CACHE_TAGS.SEO_META);
    console.log(`[SEO REVALIDATION] Invalidated SEO metadata cache`);

    return Response.json({
      success: true,
      message: "🔍 SEO metadata cache invalidated!",
      description:
        "Page metadata, structured data, and Open Graph content will be regenerated",
      revalidatedTag: MASTER_CACHE_TAGS.SEO_META,
      timestamp: new Date().toISOString(),
      affectedContent: [
        "Page titles and descriptions",
        "Open Graph images and metadata",
        "Structured data (JSON-LD)",
        "Meta keywords",
        "Twitter Card data",
      ],
      nextSteps: [
        "Visit /ar or /fr to see updated SEO metadata",
        "Check page source for updated meta tags",
        "Verify structured data with Google's Rich Results Test",
      ],
    });
  } catch (error) {
    console.error("Error revalidating SEO cache:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    title: "🔍 SEO Metadata Revalidation",
    description:
      "Invalidates SEO-specific cache including metadata, structured data, and Open Graph content",
    usage: {
      method: "POST",
      url: "/api/revalidate/seo",
      body: {
        secret: "your-revalidation-secret",
      },
    },
    affectedContent: [
      "Dynamic page titles with product names",
      "Meta descriptions with current product lists",
      "Open Graph images from featured products",
      "JSON-LD structured data for products",
      "Dynamic keywords based on current inventory",
    ],
    whenToUse: [
      "After adding new featured products",
      "When product names or descriptions change",
      "After updating product images",
      "When optimizing SEO content",
      "Before major product launches",
    ],
    example: `curl -X POST ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/revalidate/seo \\
  -H "Content-Type: application/json" \\
  -d '{"secret": "your-secret"}'`,
    testTools: [
      "Google Rich Results Test: https://search.google.com/test/rich-results",
      "Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/",
      "Twitter Card Validator: https://cards-dev.twitter.com/validator",
    ],
  });
}
