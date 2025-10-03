import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the tag from the request body
    const body = await request.json();
    const { tag, secret } = body;

    // Security check - you should use a secret to prevent unauthorized access
    if (secret !== process.env.REVALIDATION_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the tag
    const validTags = ["products", "categories", "sections"];
    if (!tag || !validTags.includes(tag)) {
      return Response.json(
        {
          error: "Invalid tag. Must be one of: products, categories, sections",
        },
        { status: 400 }
      );
    }

    // Revalidate the specific tag
    revalidateTag(tag);

    return Response.json({
      success: true,
      message: `Cache invalidated for tag: ${tag}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating cache:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET endpoint to show usage instructions
export async function GET() {
  return Response.json({
    message: "Cache revalidation endpoint",
    usage: {
      method: "POST",
      body: {
        tag: "products | categories | sections",
        secret: "your-secret-key",
      },
    },
    availableTags: ["products", "categories", "sections"],
    example: {
      curl: `curl -X POST ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/revalidate/tag \\
  -H "Content-Type: application/json" \\
  -d '{"tag": "products", "secret": "your-secret"}'`,
    },
  });
}
