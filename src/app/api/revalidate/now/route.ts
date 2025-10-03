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

    // Revalidate the master "landing-page" tag (invalidates ALL landing page data)
    revalidateTag("landing-page");
    console.log(
      `[REVALIDATION] Invalidated all landing page cache using master tag`
    );

    return Response.json({
      success: true,
      message: "🎉 Landing page cache completely invalidated!",
      description:
        "All products, categories, and sections will be refetched on next visit",
      masterTag: "landing-page",
      timestamp: new Date().toISOString(),
      nextSteps: [
        "Visit /ar or /fr to see fresh data",
        "Check server logs for [CACHE] messages to confirm regeneration",
      ],
    });
  } catch (error) {
    console.error("Error revalidating landing page cache:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    title: "🚀 One-Click Landing Page Revalidation",
    description: "Invalidates ALL landing page cache with a single API call",
    usage: {
      method: "POST",
      url: "/api/revalidate/now",
      body: {
        secret: "your-revalidation-secret",
      },
    },
    whatItDoes: [
      "Invalidates products cache",
      "Invalidates categories cache",
      "Invalidates sections cache",
      "Forces fresh data fetch on next page visit",
    ],
    example: `curl -X POST ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/revalidate/now \\
  -H "Content-Type: application/json" \\
  -d '{"secret": "your-secret"}'`,
    testEndpoint: "Visit this endpoint in browser to see instructions",
  });
}
