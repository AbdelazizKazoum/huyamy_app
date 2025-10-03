import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Security check
    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Revalidate all landing page related tags at once
    const landingPageTags = ["products", "categories", "sections"];

    landingPageTags.forEach((tag) => {
      revalidateTag(tag);
      console.log(`[REVALIDATION] Invalidated cache for tag: ${tag}`);
    });

    return Response.json({
      success: true,
      message: "Landing page cache completely invalidated",
      revalidatedTags: landingPageTags,
      timestamp: new Date().toISOString(),
      note: "The page will regenerate on the next visit",
    });
  } catch (error) {
    console.error("Error revalidating landing page cache:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: "Landing page cache revalidation endpoint",
    description:
      "Invalidates all landing page cache (products, categories, sections) at once",
    usage: {
      method: "POST",
      body: {
        secret: "your-secret-key",
      },
    },
    willRevalidate: ["products", "categories", "sections"],
    example: {
      curl: `curl -X POST ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/revalidate/landing-page \\
  -H "Content-Type: application/json" \\
  -d '{"secret": "your-secret"}'`,
    },
  });
}
