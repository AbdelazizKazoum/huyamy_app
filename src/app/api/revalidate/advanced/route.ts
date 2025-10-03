import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, method = "tags" } = body;

    // Security check
    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (method === "path") {
      // Method 1: Revalidate by path (revalidates the entire page)
      revalidatePath("/[locale]", "page");
      console.log("[REVALIDATION] Revalidated path: /[locale]");

      return Response.json({
        success: true,
        message: "Landing page revalidated by path",
        method: "revalidatePath",
        path: "/[locale]",
        timestamp: new Date().toISOString(),
      });
    } else {
      // Method 2: Revalidate by tags (more granular)
      const tags = ["products", "categories", "sections"];
      tags.forEach((tag) => {
        revalidateTag(tag);
        console.log(`[REVALIDATION] Invalidated cache for tag: ${tag}`);
      });

      return Response.json({
        success: true,
        message: "Landing page revalidated by tags",
        method: "revalidateTag",
        revalidatedTags: tags,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error revalidating:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: "Advanced revalidation endpoint",
    description: "Revalidate landing page using either path or tags method",
    methods: {
      tags: {
        description:
          "Revalidates specific cached data (products, categories, sections)",
        body: { secret: "your-secret", method: "tags" },
      },
      path: {
        description: "Revalidates the entire page and all its data",
        body: { secret: "your-secret", method: "path" },
      },
    },
    examples: {
      revalidateByTags: `curl -X POST ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/revalidate/advanced \\
  -H "Content-Type: application/json" \\
  -d '{"secret": "your-secret", "method": "tags"}'`,
      revalidateByPath: `curl -X POST ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/revalidate/advanced \\
  -H "Content-Type: application/json" \\
  -d '{"secret": "your-secret", "method": "path"}'`,
    },
  });
}
