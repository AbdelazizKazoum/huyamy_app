import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    console.log("Testing Firebase Admin connection...");

    // Try to access Firestore
    const testQuery = adminDb.collection("orders").limit(1);
    console.log("Query created successfully");

    const snapshot = await testQuery.get();
    console.log("Query executed successfully");

    return NextResponse.json({
      success: true,
      message: "Firebase Admin is working correctly",
      timestamp: new Date().toISOString(),
      documentsFound: snapshot.size,
    });
  } catch (error) {
    console.error("Firebase Admin test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Firebase Admin connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
